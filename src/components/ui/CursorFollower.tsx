import { useEffect, useRef, useState } from 'react'

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    let mouseX = 0, mouseY = 0
    let dotX = 0, dotY = 0
    let ringX = 0, ringY = 0
    let isDown = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown = () => { isDown = true; ringRef.current?.classList.add('cursor-ring--click') }
    const onUp = () => { isDown = false; ringRef.current?.classList.remove('cursor-ring--click') }

    const animate = () => {
      dotX += (mouseX - dotX) * 0.2
      dotY += (mouseY - dotY) * 0.2
      ringX += (mouseX - ringX) * 0.08
      ringY += (mouseY - ringY) * 0.08
      if (dotRef.current) dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`
      requestAnimationFrame(animate)
    }

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], .glass-card').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          ringRef.current?.classList.add('cursor-ring--hover')
          dotRef.current?.classList.add('cursor-dot--hover')
        })
        el.addEventListener('mouseleave', () => {
          ringRef.current?.classList.remove('cursor-ring--hover')
          dotRef.current?.classList.remove('cursor-dot--hover')
        })
      })
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    const raf = requestAnimationFrame(animate)
    addHoverListeners()
    document.addEventListener('astro:page-load', addHoverListeners)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (typeof window === 'undefined') return null

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={dotRef}
        className={`cursor-dot w-2 h-2 rounded-full bg-accent-500/80 transition-[opacity,width,height] duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ position: 'fixed', top: 0, left: 0, willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring w-10 h-10 rounded-full border-[1.5px] border-accent-400/50 transition-[width,height,opacity,border-color,margin] duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ position: 'fixed', top: 0, left: 0, willChange: 'transform' }}
      />
    </div>
  )
}
