import { useState, useEffect, useRef } from 'react'

export default function InteractiveFrog() {
  const [position, setPosition] = useState({ x: 150, y: 150 })
  const [state, setState] = useState<'idle' | 'walking' | 'jumping' | 'excited'>('idle')
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [squish, setSquish] = useState(1)
  const [rotation, setRotation] = useState(0)
  const frogRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: 150, y: 150 })
  const animationRef = useRef<number>(0)
  const idleAnimationRef = useRef<number>(0)

  // 呼吸动画（idle时）
  useEffect(() => {
    if (state === 'idle') {
      let time = 0
      const breathe = () => {
        time += 0.02
        const breathScale = 1 + Math.sin(time) * 0.03
        setSquish(breathScale)
        idleAnimationRef.current = requestAnimationFrame(breathe)
      }
      idleAnimationRef.current = requestAnimationFrame(breathe)
      return () => {
        if (idleAnimationRef.current) cancelAnimationFrame(idleAnimationRef.current)
      }
    } else {
      if (idleAnimationRef.current) cancelAnimationFrame(idleAnimationRef.current)
    }
  }, [state])

  // 自动随机移动
  useEffect(() => {
    const randomMove = () => {
      if (state === 'idle' && Math.random() > 0.7) {
        const maxX = window.innerWidth - 200
        const maxY = window.innerHeight - 200
        targetRef.current = {
          x: Math.max(50, Math.random() * maxX),
          y: Math.max(50, Math.random() * maxY)
        }
        setState('walking')
      }
    }

    const interval = setInterval(randomMove, 4000)
    return () => clearInterval(interval)
  }, [state])

  // 移动动画
  useEffect(() => {
    if (state === 'walking' || state === 'jumping') {
      const dx = targetRef.current.x - position.x
      const dy = targetRef.current.y - position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 10) {
        setDirection(dx > 0 ? 'right' : 'left')

        // 行走时左右摇摆
        if (state === 'walking') {
          const speed = 2
          const ratio = speed / distance

          setPosition(prev => ({
            x: prev.x + dx * ratio,
            y: prev.y + dy * ratio
          }))

          // 摇摆效果
          setRotation(Math.sin(Date.now() * 0.01) * 5)
        }
        // 跳跃
        else if (state === 'jumping') {
          // 起跳拉伸
          setSquish(1.3)
          setTimeout(() => {
            setPosition(targetRef.current)
            setSquish(0.7) // 落地压扁
            setTimeout(() => {
              setSquish(1)
              setState('idle')
              setRotation(0)
            }, 200)
          }, 400)
        }
      } else {
        setState('idle')
        setRotation(0)
      }

      animationRef.current = requestAnimationFrame(() => {})
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [position, state])

  // 点击互动
  const handleClick = () => {
    setState('excited')
    // 兴奋跳动
    setSquish(0.8)
    setTimeout(() => setSquish(1.2), 100)
    setTimeout(() => setSquish(0.9), 200)
    setTimeout(() => {
      setSquish(1)
      setState('idle')
    }, 2000)
  }

  // 跟随鼠标
  const handleMouseMove = (e: MouseEvent) => {
    if (e.shiftKey && (state === 'idle' || state === 'walking')) {
      targetRef.current = { x: e.clientX - 100, y: e.clientY - 100 }
      setState('jumping')
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [state])

  return (
    <div
      ref={frogRef}
      onClick={handleClick}
      className="fixed z-50 cursor-pointer select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scaleX(${direction === 'left' ? -1 : 1}) scaleY(${squish}) rotate(${rotation}deg)`,
        transition: state === 'jumping' ? 'all 0.4s cubic-bezier(0.45, 0, 0.55, 1)' : state === 'walking' ? 'left 0.05s, top 0.05s, transform 0.1s' : 'transform 0.1s'
      }}
      title="按住 Shift 键移动鼠标，奶蛙会跳过来！点击我！"
    >
      {/* 影子 */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black rounded-full blur-xl transition-all"
        style={{
          width: `${120 * (1 / squish)}px`,
          height: '20px',
          opacity: state === 'jumping' ? 0.1 : 0.25
        }}
      />

      {/* 奶蛙图片 */}
      <img
        src="/images/naiwa-transparent.png"
        alt="奶蛙"
        className="relative w-48 h-48 object-contain drop-shadow-2xl pointer-events-none"
        style={{
          filter: state === 'excited' ? 'brightness(1.15) drop-shadow(0 0 20px rgba(255,255,100,0.8))' : 'none'
        }}
      />

      {/* 呱呱气泡 */}
      {state === 'excited' && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-xl animate-bounce border-2 border-yellow-300">
          <span className="text-xl font-bold text-yellow-600">呱呱! 🐸</span>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
        </div>
      )}

      {/* 爱心（跳跃时） */}
      {state === 'jumping' && (
        <>
          <div className="absolute -top-8 left-8 text-3xl animate-float-up">💕</div>
          <div className="absolute -top-6 right-10 text-2xl animate-float-up-delay">💕</div>
        </>
      )}

      {/* 行走时的脚印 */}
      {state === 'walking' && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl opacity-40">
          👣
        </div>
      )}

      {/* 跳跃特效 */}
      {state === 'jumping' && squish > 1 && (
        <>
          <div className="absolute bottom-0 left-4 text-3xl animate-fade-out">💨</div>
          <div className="absolute bottom-0 right-4 text-3xl animate-fade-out">💨</div>
        </>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
        }
        @keyframes fade-out {
          0% { opacity: 1; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
        .animate-float-up-delay {
          animation: float-up 1s ease-out 0.2s forwards;
        }
        .animate-fade-out {
          animation: fade-out 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
