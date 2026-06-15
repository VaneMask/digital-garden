import { useState, useMemo } from 'react'

interface Moment {
  id: string
  content: string
  images?: string[]
  tags?: string[]
  date: Date
  location?: string
}

interface Props { moments: Moment[] }

function timeAgo(d: Date) {
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 604800) return `${Math.floor(diff / 86400)} 天前`
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

export default function MomentList({ moments }: Props) {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)

  const filtered = useMemo(() => {
    let result = [...moments]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((m) => m.content.toLowerCase().includes(q) || (m.location || '').toLowerCase().includes(q))
    }
    result.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
      return sortOrder === 'desc' ? -diff : diff
    })
    return result
  }, [moments, search, sortOrder])

  const left = filtered.filter((_, i) => i % 2 === 0)
  const right = filtered.filter((_, i) => i % 2 === 1)

  const renderImages = (images: string[]) => {
    const c = images.length
    if (c === 0) return null
    if (c === 1) {
      return (
        <div className="mt-5 flex justify-center">
          <div onClick={() => setLightbox({ images, index: 0 })} className="max-w-[85%] overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 shadow-lg cursor-zoom-in group">
            <img src={images[0]} alt="" className="w-full max-h-[400px] object-contain group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      )
    }
    const cols = c === 4 ? 2 : 3
    return (
      <div className="mt-5 flex justify-center">
        <div className="grid gap-1.5 w-full max-w-[320px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {images.slice(0, 9).map((src, i) => {
            const isLast = i === 8 && c > 9
            return (
              <div key={i} onClick={() => setLightbox({ images, index: i })} className="group relative aspect-square overflow-hidden rounded-xl bg-surface-200 dark:bg-surface-800 border border-black/5 dark:border-white/10 cursor-zoom-in">
                <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {isLast && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-black">+{c - 9}</div>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .moment-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) }
        .moment-card:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.06) }
        .dark .moment-card:hover { box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.3) }
      `}</style>

      <div className="w-full max-w-5xl mx-auto py-8 md:py-12 mt-16 md:mt-20 relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center">
          <p className="text-xs font-medium tracking-[0.2em] text-accent-500 uppercase mb-3">Moments</p>
          <h1 className="text-3xl md:text-5xl font-bold text-ink-100 dark:text-ink-inverted tracking-tight mb-3">说说</h1>
          <p className="text-sm text-ink-300/80 dark:text-ink-inverted/40 italic">在代码之外捕捉瞬间的温度</p>
        </div>

        {/* Controls */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <input type="text" placeholder="搜索记忆..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl px-5 py-3.5 pl-12 text-sm text-ink-100 dark:text-ink-inverted shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-400/30 transition-all"
            />
          </div>
          <div className="flex bg-white/40 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10">
            <button onClick={() => setSortOrder('desc')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${sortOrder === 'desc' ? 'bg-accent-500 text-white shadow-md' : 'text-ink-300 hover:text-accent-500'}`}>最新</button>
            <button onClick={() => setSortOrder('asc')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${sortOrder === 'asc' ? 'bg-accent-500 text-white shadow-md' : 'text-ink-300 hover:text-accent-500'}`}>最早</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center glass-card p-12 max-w-md w-full">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent-50 dark:bg-accent-400/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-.132 0-.263 0-.393 0a7.5 7.5 0 007.92 12.446A9 9 0 1112 2.992z"/></svg>
              </div>
              <h2 className="text-xl font-bold text-ink-100 dark:text-ink-inverted mb-2">{search ? '没有找到' : '空空如也'}</h2>
              <p className="text-sm text-ink-300/70">{search ? '换个关键词试试' : '还没有记录下任何生活碎片'}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-5 md:gap-6 pb-24 w-full items-start">
            <div className="flex-1 flex flex-col gap-5 md:gap-6 w-full min-w-0">
              {left.map((m, i) => (
                <div key={m.id} className="moment-card glass-card p-5 md:p-7 overflow-hidden" style={{ animation: `fadeUpIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s both` }}>
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-black/3 dark:border-white/5">
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                      <img src="/images/avatar.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink-200 dark:text-ink-inverted/70">VaneMask</h3>
                      <p className="text-[11px] text-ink-300/60 mt-0.5">{timeAgo(new Date(m.date))}</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-ink-100 dark:text-ink-inverted leading-relaxed whitespace-pre-wrap break-words">{m.content}</p>
                  {m.images && renderImages(m.images)}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      {m.location && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-400/10 text-accent-500 max-w-full truncate border border-accent-400/10">
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                          <span className="truncate">{m.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {m.tags && m.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {m.tags.map((t) => <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-200 dark:bg-surface-800 text-ink-300/80">{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-5 md:gap-6 w-full min-w-0">
              {right.map((m, i) => (
                <div key={m.id} className="moment-card glass-card p-5 md:p-7 overflow-hidden" style={{ animation: `fadeUpIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.1 + 0.05}s both` }}>
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-black/3 dark:border-white/5">
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                      <img src="/images/avatar.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink-200 dark:text-ink-inverted/70">VaneMask</h3>
                      <p className="text-[11px] text-ink-300/60 mt-0.5">{timeAgo(new Date(m.date))}</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-ink-100 dark:text-ink-inverted leading-relaxed whitespace-pre-wrap break-words">{m.content}</p>
                  {m.images && renderImages(m.images)}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      {m.location && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-400/10 text-accent-500 max-w-full truncate border border-accent-400/10">
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                          <span className="truncate">{m.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {m.tags && m.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {m.tags.map((t) => <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-200 dark:bg-surface-800 text-ink-300/80">{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center cursor-pointer" onClick={() => setLightbox(null)}>
          {lightbox.images.length > 1 && (
            <>
              <button className="absolute left-4 md:left-12 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white z-50" onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: lightbox.index > 0 ? lightbox.index - 1 : lightbox.images.length - 1 }) }}><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg></button>
              <button className="absolute right-4 md:right-12 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white z-50" onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length }) }}><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg></button>
            </>
          )}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <img src={lightbox.images[lightbox.index]} className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" alt="" />
            <div className="absolute bottom-8 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
