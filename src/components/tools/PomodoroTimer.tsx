import { useState, useEffect, useCallback, useRef } from 'react'

type Mode = 'work' | 'break'
const DEFAULTS = { work: 25, break: 5 }
const LABELS: Record<Mode, string> = { work: '专注', break: '休息' }

export default function PomodoroTimer() {
  const [durations, setDurations] = useState(DEFAULTS)
  const [mode, setMode] = useState<Mode>('work')
  const [seconds, setSeconds] = useState(DEFAULTS.work * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioRef.current = null
    ;(window as any).__pomodoroCtx = ctx
  }, [])

  const playBeep = () => {
    try {
      const ctx: AudioContext = (window as any).__pomodoroCtx
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume()
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 800
        osc.type = 'sine'
        gain.gain.value = 0.3
        const start = ctx.currentTime + i * 0.3
        osc.start(start)
        osc.stop(start + 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15)
      }
    } catch {}
  }

  const notify = useCallback((msg: string) => {
    playBeep()
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🍅 番茄钟', { body: msg, icon: '/images/avatar.jpg' })
    }
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer)
          setRunning(false)
          if (mode === 'work') {
            const next = sessions + 1
            setSessions(next)
            setMode('break')
            setSeconds(durations.break * 60)
            notify(`专注结束！休息 ${durations.break} 分钟`)
          } else {
            setMode('work')
            setSeconds(durations.work * 60)
            notify('休息结束！开始新的专注')
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [running, mode, sessions, durations, notify])

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const toggleTimer = () => {
    requestPermission()
    setRunning(!running)
  }

  const reset = useCallback(() => {
    setRunning(false)
    setSeconds(durations[mode] * 60)
  }, [mode, durations])

  const switchMode = (m: Mode) => {
    setMode(m)
    setSeconds(durations[m] * 60)
    setRunning(false)
  }

  const updateDuration = (m: Mode, val: number) => {
    const v = Math.max(1, Math.min(120, val))
    setDurations({ ...durations, [m]: v })
    if (mode === m && !running) setSeconds(v * 60)
  }

  const handleInputChange = (m: Mode, raw: string) => {
    if (raw === '') {
      setDurations({ ...durations, [m]: 1 })
      if (mode === m && !running) setSeconds(1 * 60)
      return
    }
    const parsed = parseInt(raw, 10)
    if (isNaN(parsed)) return
    const v = Math.max(1, Math.min(120, parsed))
    setDurations({ ...durations, [m]: v })
    if (mode === m && !running) setSeconds(v * 60)
  }

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  const progress = 1 - seconds / (durations[mode] * 60)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mode tabs */}
      <div className="flex gap-1">
        {(['work', 'break'] as Mode[]).map((m) => (
          <button key={m} onClick={() => switchMode(m)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === m ? 'bg-accent-500 text-white' : 'bg-surface-200 dark:bg-surface-800 text-ink-300'}`}>
            {LABELS[m]} {durations[m]}分钟
          </button>
        ))}
        <button onClick={() => setShowSettings(!showSettings)}
          className="w-7 h-7 rounded-full bg-surface-200 dark:bg-surface-800 text-ink-300 flex items-center justify-center hover:text-accent-500 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="w-full p-4 rounded-xl bg-surface-200/60 dark:bg-surface-800/60 border border-black/5 dark:border-white/5 space-y-3">
          {(['work', 'break'] as Mode[]).map((m) => (
            <div key={m} className="flex items-center gap-3">
              <span className="w-16 text-xs font-bold text-ink-200 dark:text-ink-inverted/60">{LABELS[m]}时间</span>
              <input
                type="number"
                min={1}
                max={120}
                value={durations[m]}
                onChange={(e) => handleInputChange(m, e.target.value)}
                className="w-16 px-2 py-1 rounded bg-white/60 dark:bg-surface-900/60 border border-black/5 dark:border-white/10 text-sm font-mono text-center text-ink-100 dark:text-ink-inverted focus:outline-none focus:ring-2 focus:ring-accent-400/50"
              />
              <span className="text-xs text-ink-300/50">分钟</span>
            </div>
          ))}
        </div>
      )}

      {/* Timer ring */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-200 dark:text-surface-800" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${progress * 283} 283`}
            className={`transition-all duration-1000 ${mode === 'work' ? 'text-accent-500' : 'text-green-500'}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-mono font-bold text-ink-100 dark:text-ink-inverted">{mins}:{secs}</span>
          <span className="text-[10px] text-ink-300/50 mt-1">{LABELS[mode]}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button onClick={toggleTimer}
          className="px-6 py-2 rounded-full bg-accent-500 text-white text-sm font-bold hover:opacity-80 transition-opacity">
          {running ? '暂停' : '开始'}
        </button>
        <button onClick={reset}
          className="px-4 py-2 rounded-full bg-surface-200 dark:bg-surface-800 text-ink-300 text-sm font-bold hover:opacity-80 transition-opacity">
          重置
        </button>
      </div>
      <p className="text-xs text-ink-300/60">已完成 {sessions} 个番茄</p>
    </div>
  )
}