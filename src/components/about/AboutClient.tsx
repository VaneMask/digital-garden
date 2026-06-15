import { useState, useMemo } from 'react'

interface Activity {
  date: string
  title: string
  type: string
  url: string
}

export default function AboutClient({ activities }: { activities: Activity[] }) {
  const [tab, setTab] = useState<'intro' | 'activity'>('intro')

  // GitHub-style heatmap
  const { weeks, activityMap } = useMemo(() => {
    const today = new Date()
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const start = new Date(end)
    start.setDate(end.getDate() - 364)
    start.setDate(start.getDate() - start.getDay())

    const map: Record<string, number> = {}
    activities.forEach((a) => {
      const d = new Date(a.date)
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        map[key] = (map[key] || 0) + 1
      }
    })

    const weeksArr: Date[][] = []
    let curr = new Date(start)
    let week: Date[] = []
    while (curr <= end) {
      week.push(new Date(curr))
      if (week.length === 7) { weeksArr.push(week); week = [] }
      curr.setDate(curr.getDate() + 1)
    }
    if (week.length) weeksArr.push(week)
    return { weeks: weeksArr, activityMap: map }
  }, [activities])

  const getColor = (count: number) => {
    if (count === 0) return 'bg-surface-200 dark:bg-surface-800'
    if (count === 1) return 'bg-green-300/70 dark:bg-green-800/70'
    if (count === 2) return 'bg-green-400/80 dark:bg-green-700/80'
    if (count === 3) return 'bg-green-500/90 dark:bg-green-600/90'
    return 'bg-green-600 dark:bg-green-500'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case '文章': return 'text-accent-500'
      case '说说': return 'text-pink-500'
      default: return 'text-ink-300'
    }
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    if (isNaN(date.getTime())) return d
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const monthLabels = () => {
    const labels: { idx: number; label: string }[] = []
    weeks.forEach((week, i) => {
      const first = week[0]
      if (first.getDate() <= 7) {
        labels.push({ idx: i, label: first.toLocaleString('en-US', { month: 'short' }) })
      }
    })
    return labels
  }

  return (
    <>
      {/* Cover */}
      <div className="w-full h-36 sm:h-44 md:h-56 relative bg-surface-200 dark:bg-surface-800 overflow-hidden rounded-t-[2.5rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-200/40 via-accent-300/30 to-blue-200/30 dark:from-accent-500/20 dark:via-accent-400/10 dark:to-blue-400/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-100/60 dark:from-surface-900/60 to-transparent" />
      </div>

      <div className="px-5 sm:px-8 md:px-16 pb-10 md:pb-16 -mt-12 md:-mt-16 relative z-10">
        {/* Avatar */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full ring-4 ring-surface-100 dark:ring-surface-900 shadow-xl overflow-hidden bg-surface-100">
          <img src="/images/avatar.jpg" alt="" className="w-full h-full object-cover" />
        </div>

        {/* Title + Tabs */}
        <div className="mt-4 md:mt-6 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-ink-100 dark:text-ink-inverted tracking-tight">关于我</h1>
            <p className="text-sm md:text-base text-accent-500 font-semibold tracking-widest uppercase mt-1">Hello World, I&apos;m VaneMask</p>
          </div>
          <div className="flex items-center gap-1 bg-surface-200/80 dark:bg-surface-800/80 p-1 rounded-xl">
            <button onClick={() => setTab('intro')} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 ${tab === 'intro' ? 'bg-accent-500 text-white shadow-md' : 'text-ink-300 hover:text-accent-500'}`}>自我介绍</button>
            <button onClick={() => setTab('activity')} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 ${tab === 'activity' ? 'bg-accent-500 text-white shadow-md' : 'text-ink-300 hover:text-accent-500'}`}>最近动态</button>
          </div>
        </div>

        <div className="w-full h-px bg-black/5 dark:bg-white/10 mb-6" />

        {/* Tab: Intro */}
        {tab === 'intro' && (
          <div className="space-y-8" style={{ animation: 'fadeUpIn 0.4s ease' }}>
            <div className="prose prose-lg max-w-none text-ink-200 dark:text-ink-inverted/80 leading-relaxed">
              <p className="text-base md:text-lg leading-relaxed">
                你好，我是 VaneMask。计算机科学在读学生，热爱设计与开发。
              </p>
              <p className="text-sm md:text-base leading-relaxed mt-4">
                我相信技术可以创造美好，目前专注于 Web 全栈开发与系统设计。
                课余时间喜欢摄影、阅读和探索新工具。这个网站就是我的数字花园，用来记录学习、思考和生活中的点点滴滴。
              </p>
              <h3 className="text-lg font-bold text-ink-100 dark:text-ink-inverted mt-8 mb-4">技能方向</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {['TypeScript / React', 'Node.js', 'Python', 'CSS / Tailwind', 'Git / GitHub', 'SQL / 数据库'].map((s) => (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-200/80 dark:bg-surface-800/80 text-ink-200 dark:text-ink-inverted/70 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />{s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Activity */}
        {tab === 'activity' && (
          <div style={{ animation: 'fadeUpIn 0.4s ease' }}>
            {/* Heatmap */}
            <div className="mb-10 p-4 md:p-6 bg-surface-200/60 dark:bg-surface-800/40 rounded-2xl border border-black/5 dark:border-white/5">
              <h3 className="text-sm font-bold text-ink-200 dark:text-ink-inverted/70 mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"/></svg>
                {activities.length} 次更新 · 过去一年
              </h3>
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[700px]">
                  <div className="flex gap-[3px] text-[9px] text-ink-300/60 mb-1 h-3">
                    {monthLabels().map((m) => (
                      <div key={m.idx} className="w-[10px] md:w-[12px] shrink-0" style={{ marginLeft: m.idx === 0 ? 0 : `calc(${m.idx} * 13px - ${m.idx * 1}px)` }}>
                        {/* approximate month positioning */}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-[3px]">
                    {weeks.map((week, i) => (
                      <div key={i} className="flex flex-col gap-[3px]">
                        {week.map((day, j) => {
                          const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
                          const count = activityMap[key] || 0
                          return <div key={j} title={`${key}: ${count}`} className={`w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] ${getColor(count)}`} />
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-2 text-[9px] text-ink-300/60">Less <span className="w-2.5 h-2.5 rounded-[2px] bg-surface-200 dark:bg-surface-800" /><span className="w-2.5 h-2.5 rounded-[2px] bg-green-300/70" /><span className="w-2.5 h-2.5 rounded-[2px] bg-green-400/80" /><span className="w-2.5 h-2.5 rounded-[2px] bg-green-500/90" /><span className="w-2.5 h-2.5 rounded-[2px] bg-green-600" /> More</div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 md:pl-8 border-l-2 border-accent-400/20 space-y-5">
              {activities.slice(0, 20).map((act, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[26px] md:-left-[34px] top-4 w-2.5 h-2.5 md:w-3 md:h-3 bg-surface-100 dark:bg-surface-900 ring-2 ring-accent-400 rounded-full group-hover:scale-125 transition-transform z-10" />
                  <a href={act.url} className="block glass-card p-4 group-hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <img src="/images/avatar.jpg" alt="" className="w-8 h-8 md:w-9 md:h-9 rounded-full ring-1 ring-black/5 shrink-0" />
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-ink-200 dark:text-ink-inverted/70">VaneMask</span>
                            <span className={`text-[10px] font-bold ${getTypeColor(act.type)}`}>{act.type === '说说' ? '发布了说说' : `更新了${act.type}`}</span>
                          </div>
                          {act.type !== '说说' && <p className="text-sm font-bold text-ink-100 dark:text-ink-inverted truncate mt-0.5">{act.title}</p>}
                        </div>
                        <span className="text-[10px] text-ink-300/50 shrink-0 hidden md:block">{formatDate(act.date)}</span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
              {activities.length === 0 && <p className="text-sm text-ink-300/60 py-8 text-center">暂无活动记录</p>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
