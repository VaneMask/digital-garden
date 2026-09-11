import { useState, useEffect } from 'react'
import { supabase, getUserId } from '@/lib/supabase'

interface Todo { id: number; text: string; done: boolean; created_at?: string }

const STORAGE_KEY = 'diy-todos'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [syncing, setSyncing] = useState(false)

  // 初始加载：优先从云端加载，如果失败则使用本地数据
  useEffect(() => {
    loadTodos()

    // 设置实时订阅
    const userId = getUserId()
    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `device_id=eq.${userId}`
        },
        (payload) => {
          handleRealtimeChange(payload)
        }
      )
      .subscribe()

    // 清理订阅
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 处理实时变更
  const handleRealtimeChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newTodo = {
        id: payload.new.id,
        text: payload.new.text,
        done: payload.new.done,
        created_at: payload.new.created_at
      }
      setTodos(prev => {
        // 避免重复添加
        if (prev.some(t => t.id === newTodo.id)) return prev
        return [...prev, newTodo]
      })
    } else if (payload.eventType === 'UPDATE') {
      setTodos(prev => prev.map(t =>
        t.id === payload.new.id
          ? { id: payload.new.id, text: payload.new.text, done: payload.new.done, created_at: payload.new.created_at }
          : t
      ))
    } else if (payload.eventType === 'DELETE') {
      setTodos(prev => prev.filter(t => t.id !== payload.old.id))
    }
  }

  // 自动保存到云端
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
  }, [todos])

  const loadTodos = async () => {
    setSyncing(true)
    try {
      const userId = getUserId()
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('device_id', userId)
        .order('id', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        // 云端有数据，使用云端数据
        setTodos(data.map(item => ({
          id: item.id,
          text: item.text,
          done: item.done
        })))
      } else {
        // 云端没有数据，尝试从本地恢复
        try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            const localTodos = JSON.parse(saved)
            setTodos(localTodos)
            // 将本地数据同步到云端
            await syncLocalToCloud(localTodos)
          }
        } catch {}
      }
    } catch (error) {
      console.error('加载失败，使用本地数据:', error)
      // 加载失败，使用本地数据
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) setTodos(JSON.parse(saved))
      } catch {}
    } finally {
      setSyncing(false)
    }
  }

  const syncLocalToCloud = async (localTodos: Todo[]) => {
    const userId = getUserId()
    for (const todo of localTodos) {
      await supabase.from('todos').insert({
        text: todo.text,
        done: todo.done,
        device_id: userId
      })
    }
  }

  const add = async () => {
    if (!input.trim()) return

    const userId = getUserId()
    const newTodo = { text: input.trim(), done: false, device_id: userId }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert(newTodo)
        .select()
        .single()

      if (error) throw error

      setTodos([...todos, { id: data.id, text: data.text, done: data.done, created_at: data.created_at }])
      setInput('')
    } catch (error) {
      console.error('添加失败:', error)
      // 添加失败时使用本地ID
      setTodos([...todos, { id: Date.now(), text: input.trim(), done: false, created_at: new Date().toISOString() }])
      setInput('')
    }
  }

  const toggle = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    const newDone = !todo.done

    try {
      const { error } = await supabase
        .from('todos')
        .update({ done: newDone })
        .eq('id', id)

      if (error) throw error

      setTodos(todos.map((t) => t.id === id ? { ...t, done: newDone } : t))
    } catch (error) {
      console.error('更新失败:', error)
      // 更新失败也在本地更新，等待下次同步
      setTodos(todos.map((t) => t.id === id ? { ...t, done: newDone } : t))
    }
  }

  const remove = async (id: number) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTodos(todos.filter((t) => t.id !== id))
    } catch (error) {
      console.error('删除失败:', error)
      // 删除失败也在本地删除
      setTodos(todos.filter((t) => t.id !== id))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="添加待办事项..." className="flex-1 px-3 py-2 rounded-lg bg-surface-200/60 dark:bg-surface-800/60 border border-black/5 dark:border-white/5 text-sm text-ink-100 dark:text-ink-inverted focus:outline-none focus:ring-2 focus:ring-accent-400/50" />
        <button onClick={add} className="px-4 py-2 rounded-lg bg-accent-500 text-white text-sm font-bold hover:opacity-80 transition-opacity">添加</button>
      </div>
      <div className="space-y-1.5 max-h-60 overflow-y-auto">
        {todos.map((t) => (
          <div key={t.id} className="flex items-center gap-2 group">
            <button onClick={() => toggle(t.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${t.done ? 'bg-accent-500 border-accent-500' : 'border-ink-300/30 hover:border-accent-400'}`}>
              {t.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </button>
            <div className="flex-1 min-w-0">
              <span className={`block text-sm ${t.done ? 'line-through text-ink-300/40' : 'text-ink-100 dark:text-ink-inverted'}`}>{t.text}</span>
              {t.created_at && (
                <span className="text-[10px] text-ink-300/40">
                  {new Date(t.created_at).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>
            <button onClick={() => remove(t.id)} className="text-ink-300/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
      {todos.length > 0 && (
        <p className="text-[10px] text-ink-300/40 text-right flex items-center justify-end gap-1">
          {syncing && <span className="inline-block w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>}
          {todos.filter(t => t.done).length}/{todos.length} 已完成
        </p>
      )}
    </div>
  )
}
