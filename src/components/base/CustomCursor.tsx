import { useEffect, useState, useRef } from 'react'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [clicked, setClicked] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile) return

    setHidden(false)

    let rafId: number
    let mouseX = -100
    let mouseY = -100
    let currentX = -100
    let currentY = -100

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseDown = () => setClicked(true)
    const onMouseUp = () => setClicked(false)

    // Detect hover on interactive elements
    const onElementEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, [role="button"], input, textarea, [data-cursor-hover]')) {
        setHovered(true)
      }
    }
    const onElementLeave = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, [role="button"], input, textarea, [data-cursor-hover]')) {
        setHovered(false)
      }
    }

    // Animation loop for smooth ring following
    const animate = () => {
      const dx = mouseX - currentX
      const dy = mouseY - currentY
      currentX += dx * 0.15
      currentY += dy * 0.15
      setPos({ x: currentX, y: currentY })
      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseover', onElementEnter)
    document.addEventListener('mouseout', onElementLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseover', onElementEnter)
      document.removeEventListener('mouseout', onElementLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (hidden) return null

  return (
    <>
      <style>{`
        body, body * { cursor: none !important; }
      `}</style>
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[99999] transition-all duration-200"
        style={{
          left: pos.x - 16,
          top: pos.y - 16,
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          opacity: 1,
        }}
      >
        <div
          className={`w-full h-full rounded-full border transition-all duration-300 ${
            hovered
              ? 'border-indigo-400/40 scale-100'
              : 'border-indigo-400/20 scale-75'
          } ${clicked ? 'scale-50' : ''}`}
        />
      </div>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[99999] transition-all duration-100"
        style={{
          left: pos.x - 3,
          top: pos.y - 3,
          width: 6,
          height: 6,
        }}
      >
        <div className={`w-full h-full rounded-full bg-indigo-500 transition-all duration-200 ${
          clicked ? 'scale-150 opacity-60' : 'scale-100 opacity-90'
        }`} />
      </div>
    </>
  )
}
