import { useEffect } from 'react'

export default function CardTilt() {
  useEffect(() => {
    const initCards = () => {
      document.querySelectorAll('.glass-card').forEach((card) => {
        const el = card as HTMLElement
        if (el.dataset.tiltInit) return
        el.dataset.tiltInit = 'true'

        el.style.transformStyle = 'preserve-3d'
        el.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)'
        el.style.position = 'relative'
        el.style.overflow = 'hidden'

        const glow = document.createElement('div')
        glow.style.cssText = `
          position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;
          transition:opacity 0.4s ease;
          background:radial-gradient(circle at 50% 50%, rgba(139,116,247,0.15), transparent 70%);
        `
        el.appendChild(glow)

        const onMove = (e: MouseEvent | TouchEvent) => {
          const rect = el.getBoundingClientRect()
          let clientX: number, clientY: number
          if ('touches' in e && e.touches.length > 0) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
          } else {
            clientX = (e as MouseEvent).clientX
            clientY = (e as MouseEvent).clientY
          }
          const x = clientX - rect.left
          const y = clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const rotateX = ((y - centerY) / centerY) * -5
          const rotateY = ((x - centerX) / centerX) * 5

          el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`
          glow.style.opacity = '1'
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139,116,247,0.18), transparent 60%)`
        }

        const onLeave = () => {
          el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
          glow.style.opacity = '0'
        }

        el.addEventListener('mousemove', onMove)
        el.addEventListener('touchmove', onMove as any, { passive: true })
        el.addEventListener('mouseleave', onLeave)
        el.addEventListener('touchend', onLeave)
      })
    }

    initCards()
    document.addEventListener('astro:page-load', () => {
      document.querySelectorAll('.glass-card').forEach((c) => {
        delete (c as HTMLElement).dataset.tiltInit
      })
      initCards()
    })
  }, [])

  return null
}
