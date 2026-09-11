import { useState, useEffect, useRef } from 'react'

export default function InteractiveFrog() {
  const [position, setPosition] = useState({ x: 150, y: 150 })
  const [state, setState] = useState<'idle' | 'jumping' | 'landing'>('idle')
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [mood, setMood] = useState<'normal' | 'happy' | 'excited'>('normal')
  const [squish, setSquish] = useState(1)
  const frogRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: 150, y: 150 })
  const animationRef = useRef<number>(0)

  // 自动随机跳动
  useEffect(() => {
    const randomJump = () => {
      if (Math.random() > 0.6 && state === 'idle') {
        const maxX = window.innerWidth - 150
        const maxY = window.innerHeight - 150
        targetRef.current = {
          x: Math.max(50, Math.random() * maxX),
          y: Math.max(50, Math.random() * maxY)
        }
        setState('jumping')
      }
    }

    const interval = setInterval(randomJump, 4000)
    return () => clearInterval(interval)
  }, [state])

  // 跳跃动画
  useEffect(() => {
    if (state === 'jumping') {
      const dx = targetRef.current.x - position.x
      const dy = targetRef.current.y - position.y
      setDirection(dx > 0 ? 'right' : 'left')

      // 起跳拉伸
      setSquish(1.2)
      setTimeout(() => setSquish(1), 100)

      // 跳跃移动
      setTimeout(() => {
        setPosition(targetRef.current)
        setState('landing')
        // 落地压扁
        setSquish(0.7)
        setTimeout(() => {
          setSquish(1)
          setState('idle')
        }, 200)
      }, 400)
    }
  }, [state, position])

  // 点击互动
  const handleClick = () => {
    setMood('excited')
    setSquish(0.8)
    setTimeout(() => setSquish(1), 150)
    setTimeout(() => setMood('normal'), 2000)
  }

  // 跟随鼠标跳跃
  const handleMouseMove = (e: MouseEvent) => {
    if (e.shiftKey && state === 'idle') {
      targetRef.current = { x: e.clientX - 75, y: e.clientY - 75 }
      setState('jumping')
      setMood('happy')
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
      className="fixed z-50 cursor-pointer transition-all duration-100"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scaleX(${direction === 'left' ? -1 : 1}) scaleY(${squish})`,
        transition: state === 'jumping' ? 'all 0.4s cubic-bezier(0.45, 0, 0.55, 1)' : 'transform 0.1s'
      }}
      title="按住 Shift 键移动鼠标，奶蛙会跳过来！点击我呱呱！"
    >
      {/* 影子 */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black rounded-full blur-md"
        style={{
          width: '100px',
          height: '20px',
          opacity: state === 'jumping' ? 0.1 : 0.2
        }}
      />

      {/* 奶蛙图片 */}
      <img
        src="/images/naiwa.jpg"
        alt="奶蛙"
        className="w-32 h-32 object-contain drop-shadow-2xl pointer-events-none select-none"
        style={{
          filter: mood === 'excited' ? 'brightness(1.1)' : 'none'
        }}
      />

      {/* 呱呱气泡（兴奋时） */}
      {mood === 'excited' && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg animate-bounce">
          <span className="text-lg font-bold">呱! 🐸</span>
        </div>
      )}

      {/* 爱心（开心时） */}
      {mood === 'happy' && (
        <>
          <div className="absolute -top-6 left-4 text-2xl animate-float">💕</div>
          <div className="absolute -top-4 right-6 text-xl animate-float-delay">💕</div>
        </>
      )}

      {/* 跳跃特效 */}
      {state === 'jumping' && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-4xl animate-ping opacity-50">
          💨
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
        }
        .animate-float {
          animation: float 1s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 1s ease-in-out infinite 0.3s;
        }
      `}</style>
    </div>
  )
}
