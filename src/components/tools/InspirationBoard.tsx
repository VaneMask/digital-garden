import { useState, useEffect } from 'react'
import { supabase, getUserId } from '@/lib/supabase'

interface Note { id: number; text: string; time: string; created_at?: string }

const STORAGE_KEY = 'diy-notes'

export default function InspirationBoard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [input, setInput] = useState('')
  const [syncing, setSyncing] = useState(false)

  // 初始加载：优先从云端加载，如果失败则使用本地数据
  useEffect(() => {
    loadNotes()

    // 设置实时订阅
    const userId = getUserId()
    const channel = supabase
      .channel('inspirations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inspirations',
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
      const newNote = {
        id: payload.new.id,
        text: payload.new.text,
        time: payload.new.time,
        created_at: payload.new.created_at
      }
      setNotes(prev => {
        // 避免重复添加
        if (prev.some(n => n.id === newNote.id)) return prev
        return [newNote, ...prev]
      })
    } else if (payload.eventType === 'UPDATE') {
      setNotes(prev => prev.map(n =>
        n.id === payload.new.id
          ? { id: payload.new.id, text: payload.new.text, time: payload.new.time, created_at: payload.new.created_at }
          : n
      ))
    } else if (payload.eventType === 'DELETE') {
      setNotes(prev => prev.filter(n => n.id !== payload.old.id))
    }
  }

  // 自动保存到本地
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    }
  }, [notes])

  const loadNotes = async () => {
    setSyncing(true)
    try {
      const userId = getUserId()
      const { data, error } = await supabase
        .from('inspirations')
        .select('*')
        .eq('device_id', userId)
        .order('id', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        // 云端有数据，使用云端数据
        setNotes(data.map(item => ({
          id: item.id,
          text: item.text,
          time: item.time
        })))
      } else {
        // 云端没有数据，尝试从本地恢复
        try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            const localNotes = JSON.parse(saved)
            setNotes(localNotes)
            // 将本地数据同步到云端
            await syncLocalToCloud(localNotes)
          }
        } catch {}
      }
    } catch (error) {
      console.error('加载失败，使用本地数据:', error)
      // 加载失败，使用本地数据
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) setNotes(JSON.parse(saved))
      } catch {}
    } finally {
      setSyncing(false)
    }
  }

  const syncLocalToCloud = async (localNotes: Note[]) => {
    const userId = getUserId()
    for (const note of localNotes) {
      await supabase.from('inspirations').insert({
        text: note.text,
        time: note.time,
        device_id: userId
      })
    }
  }

  const add = async () => {
    if (!input.trim()) return

    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const userId = getUserId()

    try {
      const { data, error } = await supabase
        .from('inspirations')
        .insert({ text: input.trim(), time, device_id: userId })
        .select()
        .single()

      if (error) throw error

      setNotes([{ id: data.id, text: data.text, time: data.time, created_at: data.created_at }, ...notes])
      setInput('')
    } catch (error) {
      console.error('添加失败:', error)
      // 添加失败时使用本地ID
      setNotes([{ id: Date.now(), text: input.trim(), time, created_at: new Date().toISOString() }, ...notes])
      setInput('')
    }
  }

  const remove = async (id: number) => {
    try {
      const { error } = await supabase
        .from('inspirations')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNotes(notes.filter((n) => n.id !== id))
    } catch (error) {
      console.error('删除失败:', error)
      // 删除失败也在本地删除
      setNotes(notes.filter((n) => n.id !== id))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="记录一个灵感..." className="flex-1 px-3 py-2 rounded-lg bg-surface-200/60 dark:bg-surface-800/60 border border-black/5 dark:border-white/5 text-sm text-ink-100 dark:text-ink-inverted focus:outline-none focus:ring-2 focus:ring-accent-400/50" />
        <button onClick={add} className="px-4 py-2 rounded-lg bg-accent-500 text-white text-sm font-bold hover:opacity-80 transition-opacity">记录</button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes.map((n) => (
          <div key={n.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-200/40 dark:bg-surface-800/40 group">
            <span className="text-[10px] text-ink-300/40 shrink-0 mt-0.5">
              {n.created_at ? new Date(n.created_at).toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }) : n.time}
            </span>
            <p className="flex-1 text-sm text-ink-100 dark:text-ink-inverted leading-relaxed">{n.text}</p>
            <button onClick={() => remove(n.id)} className="text-ink-300/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
      {notes.length === 0 && <p className="text-xs text-ink-300/40 text-center py-4">随时记录你的灵感 ✨</p>}
      {syncing && (
        <p className="text-[10px] text-ink-300/40 text-center flex items-center justify-center gap-1">
          <span className="inline-block w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
          正在同步...
        </p>
      )}
    </div>
  )
}
