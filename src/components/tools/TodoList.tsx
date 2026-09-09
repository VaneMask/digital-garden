import { useState, useEffect } from 'react'

interface Todo { id: number; text: string; done: boolean }

const STORAGE_KEY = 'diy-todos'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setTodos(JSON.parse(saved)) } catch {}
  }, [])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) }, [todos])

  const add = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input.trim(), done: false }])
    setInput('')
  }

  const toggle = (id: number) => setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  const remove = (id: number) => setTodos(todos.filter((t) => t.id !== id))

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
            <span className={`flex-1 text-sm ${t.done ? 'line-through text-ink-300/40' : 'text-ink-100 dark:text-ink-inverted'}`}>{t.text}</span>
            <button onClick={() => remove(t.id)} className="text-ink-300/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
      {todos.length > 0 && <p className="text-[10px] text-ink-300/40 text-right">{todos.filter(t => t.done).length}/{todos.length} 已完成</p>}
    </div>
  )
}
