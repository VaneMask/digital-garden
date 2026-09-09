import { useState, useEffect } from 'react'

const STORAGE_KEY = 'diy-markdown'

export default function MarkdownEditor() {
  const [text, setText] = useState('')

  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setText(saved) } catch {}
  }, [])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, text) }, [text])

  const renderMarkdown = (md: string) => {
    let html = md
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mb-3">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-surface-200 dark:bg-surface-800 text-accent-500 text-xs font-mono">$1</code>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^> (.+)$/gm, '<blockquote class="pl-3 border-l-2 border-accent-400/30 italic text-ink-300">$1</blockquote>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent-500 underline" target="_blank">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br/>')
    return `<p class="mb-2">${html}</p>`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="flex flex-col">
        <p className="text-[10px] text-ink-300/50 mb-1.5 font-bold uppercase tracking-wider">编辑</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="输入 Markdown 内容..."
          className="w-full h-64 p-3 rounded-lg bg-surface-200/60 dark:bg-surface-800/60 border border-black/5 dark:border-white/5 text-sm font-mono text-ink-100 dark:text-ink-inverted resize-none focus:outline-none focus:ring-2 focus:ring-accent-400/50" />
      </div>
      <div className="flex flex-col">
        <p className="text-[10px] text-ink-300/50 mb-1.5 font-bold uppercase tracking-wider">预览</p>
        <div className="w-full h-64 p-3 rounded-lg bg-white/50 dark:bg-surface-800/30 border border-black/5 dark:border-white/5 overflow-y-auto text-sm text-ink-100 dark:text-ink-inverted leading-relaxed prose-sm"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
      </div>
    </div>
  )
}
