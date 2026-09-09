import { useState, useEffect } from 'react'

interface Note { id: number; text: string; time: string }

const STORAGE_KEY = 'diy-notes'

export default function InspirationBoard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setNotes(JSON.parse(saved)) } catch {}
  }, [])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)) }, [notes])

  const add = () => {
    if (!input.trim()) return
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    setNotes([{ id: Date.now(), text: input.trim(), time }, ...notes])
    setInput('')
  }

  const remove = (id: number) => setNotes(notes.filter((n) => n.id !== id))

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
            <span className="text-[10px] text-ink-300/40 shrink-0 mt-0.5">{n.time}</span>
            <p className="flex-1 text-sm text-ink-100 dark:text-ink-inverted leading-relaxed">{n.text}</p>
            <button onClick={() => remove(n.id)} className="text-ink-300/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
      {notes.length === 0 && <p className="text-xs text-ink-300/40 text-center py-4">随时记录你的灵感 ✨</p>}
    </div>
  )
}
