import { useState, useRef, useCallback, useEffect } from 'react'

const PRESETS = [
  { emoji: '🏸', label: '羽毛球' },
  { emoji: '🎱', label: '桌球' },
  { emoji: '🎮', label: '打王者' },
  { emoji: '🏠', label: '待家里' },
]

const COLORS_LIGHT = [
  '#6d5cf6', '#ec4888', '#0ea5e9', '#f59e0b',
  '#10b981', '#8b5cf6', '#ef4444', '#06b6d4',
  '#f97316', '#84cc16', '#e11d48', '#6366f1',
]

const COLORS_DARK = [
  '#8b74f7', '#f4729e', '#38bdf8', '#fbbf24',
  '#34d399', '#a78bfa', '#f87171', '#22d3ee',
  '#fb923c', '#a3e635', '#fb7185', '#818cf8',
]

export default function SpinnerWheel() {
  const [items, setItems] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(0)

  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')

  const getColors = useCallback(() => (isDark ? COLORS_DARK : COLORS_LIGHT), [isDark])

  const addItem = useCallback((text: string) => {
    const t = text.trim()
    if (!t || items.length >= 12 || items.includes(t)) return
    setItems((prev) => [...prev, t])
    setResult(null)
  }, [items])

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
    setResult(null)
  }, [])

  const handleAdd = useCallback(() => {
    addItem(input)
    setInput('')
  }, [input, addItem])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleAdd()
    },
    [handleAdd]
  )

  // Draw wheel
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2
    const R = Math.min(cx, cy) - 8

    ctx.clearRect(0, 0, W, H)

    if (items.length === 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = isDark ? '#2a272b' : '#f4f0f7'
      ctx.fill()
      ctx.fillStyle = isDark ? '#8a8294' : '#8a8294'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('请添加至少 2 个选项', cx, cy)
      return
    }

    const n = items.length
    const slice = (Math.PI * 2) / n
    const colors = getColors()

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angleRef.current)

    for (let i = 0; i < n; i++) {
      const start = slice * i - Math.PI / 2
      const end = start + slice

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, R, start, end)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()

      ctx.strokeStyle = isDark ? '#1c1a1d' : '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.rotate(start + slice / 2)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#fff'
      ctx.font = `bold ${n <= 4 ? 16 : n <= 8 ? 13 : 10}px sans-serif`
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 3
      ctx.fillText(items[i], R * 0.6, 0)
      ctx.restore()
    }

    ctx.restore()

    // Center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 26, 0, Math.PI * 2)
    ctx.fillStyle = isDark ? '#1c1a1d' : '#ffffff'
    ctx.fill()
    ctx.strokeStyle = isDark ? '#3a3740' : '#e8e1ed'
    ctx.lineWidth = 2.5
    ctx.stroke()

    ctx.fillStyle = isDark ? '#e8e1ed' : '#2a2533'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('GO', cx, cy)
  }, [items, getColors, isDark])

  useEffect(() => {
    drawWheel()
  }, [drawWheel])

  // Spin
  const spin = useCallback(() => {
    if (spinning || items.length < 2) return
    setSpinning(true)
    setResult(null)

    const totalRotation = Math.PI * 2 * (5 + Math.random() * 5)
    const duration = 4000 + Math.random() * 2000
    const startTime = performance.now()
    const startAngle = angleRef.current

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const frame = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(t)

      angleRef.current = startAngle + totalRotation * eased
      drawWheel()

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        angleRef.current =
          ((angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        setSpinning(false)

        // Calculate result
        const n = items.length
        const slice = (Math.PI * 2) / n
        let rawIndex = Math.floor(-angleRef.current / slice) % n
        const index = ((rawIndex % n) + n) % n
        setResult(items[index])
      }
    }

    requestAnimationFrame(frame)
  }, [spinning, items, drawWheel])

  const emojis = ['🎉', '✨', '🎊', '🏆', '💪', '🔥', '⭐', '🎯']

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Input */}
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入选项，回车添加"
          maxLength={20}
          className="flex-1 px-3 py-2 rounded-xl bg-white/60 dark:bg-surface-900/60 border border-black/5 dark:border-white/10 text-sm text-ink-100 dark:text-ink-inverted placeholder:text-ink-300/50 focus:outline-none focus:ring-2 focus:ring-accent-400/50"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-bold hover:opacity-80 transition-opacity"
        >
          添加
        </button>
      </div>

      {/* Tags */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 w-full">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-500 text-white text-xs font-medium animate-[fadeUp_0.2s_ease]"
            >
              {item}
              <button
                onClick={() => removeItem(i)}
                className="ml-0.5 hover:opacity-60 transition-opacity"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 w-full">
        <span className="text-xs text-ink-300">快速选入：</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => addItem(p.label)}
            className="px-3 py-1 rounded-full border border-black/5 dark:border-white/10 bg-white/60 dark:bg-surface-800/60 text-xs text-ink-200 dark:text-ink-inverted/60 hover:border-accent-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-500/10 transition-all"
          >
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative">
        <div className="text-2xl text-center mb-[-4px] z-10 relative">▼</div>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="rounded-full shadow-card dark:shadow-card-dark"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || items.length < 2}
        className="px-8 py-2.5 rounded-full bg-accent-500 text-white text-base font-bold tracking-wider hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        {spinning ? '转动中...' : '转！'}
      </button>

      {/* Result */}
      {result && (
        <div className="text-center animate-[fadeUp_0.4s_ease]">
          <p className="text-2xl mb-1">
            {emojis[Math.floor(Math.random() * emojis.length)]}
          </p>
          <p className="text-lg font-bold text-ink-100 dark:text-ink-inverted">
            就决定是「{result}」！
          </p>
          <button
            onClick={() => setResult(null)}
            className="mt-2 text-xs text-accent-500 hover:underline"
          >
            再来一次
          </button>
        </div>
      )}
    </div>
  )
}
