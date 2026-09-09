import { useEffect } from 'react'

export default function ClickSparkle() {
  useEffect(() => {
    const getPos = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      if ('changedTouches' in e && e.changedTouches.length > 0) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
    }

    const sparkle = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getPos(e)
      const container = document.createElement('div')
      container.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:99998;`
      document.body.appendChild(container)

      const colors = ['#f4729e', '#8b74f7', '#38bdf8', '#f99dbb', '#a78bfa', '#7dd3fc']
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div')
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5
        const distance = 20 + Math.random() * 30
        const size = 3 + Math.random() * 4
        const color = colors[i % colors.length]
        spark.style.cssText = `
          position:absolute;width:${size}px;height:${size}px;border-radius:50%;
          background:${color};box-shadow:0 0 6px ${color};
          animation:sparkle-fly 0.6s ease-out forwards;
          --tx:${Math.cos(angle) * distance}px;--ty:${Math.sin(angle) * distance}px;
        `
        container.appendChild(spark)
      }

      const ring = document.createElement('div')
      ring.style.cssText = `
        position:absolute;left:-20px;top:-20px;width:40px;height:40px;border-radius:50%;
        border:1.5px solid rgba(139,116,247,0.5);
        animation:sparkle-ring 0.5s ease-out forwards;
      `
      container.appendChild(ring)
      setTimeout(() => container.remove(), 700)
    }

    if (!document.getElementById('sparkle-keyframes')) {
      const style = document.createElement('style')
      style.id = 'sparkle-keyframes'
      style.textContent = `
        @keyframes sparkle-fly {
          0% { opacity:1; transform:translate(0,0) scale(1); }
          100% { opacity:0; transform:translate(var(--tx),var(--ty)) scale(0); }
        }
        @keyframes sparkle-ring {
          0% { opacity:0.6; transform:scale(0); }
          100% { opacity:0; transform:scale(2.5); }
        }
      `
      document.head.appendChild(style)
    }

    document.addEventListener('click', sparkle)
    document.addEventListener('touchend', sparkle)
    document.addEventListener('astro:page-load', () => {
      document.addEventListener('click', sparkle)
      document.addEventListener('touchend', sparkle)
    })

    return () => {
      document.removeEventListener('click', sparkle)
      document.removeEventListener('touchend', sparkle)
    }
  }, [])

  return null
}
