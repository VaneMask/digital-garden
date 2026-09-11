import { useState, useEffect, useRef } from 'react'

export default function InteractiveDog() {
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [state, setState] = useState<'idle' | 'walking' | 'running' | 'sitting'>('idle')
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [mood, setMood] = useState<'happy' | 'excited' | 'playful'>('happy')
  const dogRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: 100, y: 100 })
  const animationRef = useRef<number>(0)

  // 自动随机移动
  useEffect(() => {
    const randomMove = () => {
      if (Math.random() > 0.7) {
        const maxX = window.innerWidth - 100
        const maxY = window.innerHeight - 100
        targetRef.current = {
          x: Math.random() * maxX,
          y: Math.random() * maxY
        }
        setState('walking')
      }
    }

    const interval = setInterval(randomMove, 5000)
    return () => clearInterval(interval)
  }, [])

  // 移动动画
  useEffect(() => {
    const animate = () => {
      const dx = targetRef.current.x - position.x
      const dy = targetRef.current.y - position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 5) {
        const speed = state === 'running' ? 3 : 1
        const ratio = speed / distance
        setPosition(prev => ({
          x: prev.x + dx * ratio,
          y: prev.y + dy * ratio
        }))
        setDirection(dx > 0 ? 'right' : 'left')
      } else {
        setState('idle')
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [position, state])

  // 点击互动
  const handleClick = () => {
    setMood('excited')
    setState('sitting')
    setTimeout(() => {
      setMood('happy')
      setState('idle')
    }, 2000)
  }

  // 跟随鼠标
  const handleMouseMove = (e: MouseEvent) => {
    if (e.shiftKey) {
      targetRef.current = { x: e.clientX - 40, y: e.clientY - 40 }
      setState('running')
      setMood('playful')
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={dogRef}
      onClick={handleClick}
      className="fixed z-50 cursor-pointer transition-transform hover:scale-110"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
      }}
      title="按住 Shift 键移动鼠标，小狗会跟随你！点击我互动！"
    >
      {/* 小狗身体 */}
      <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
        {/* 尾巴 */}
        <path
          d="M10 40 Q5 30, 8 20"
          stroke="#8B4513"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className={state === 'walking' || state === 'running' ? 'animate-[wag_0.5s_ease-in-out_infinite]' : ''}
        />

        {/* 身体 */}
        <ellipse cx="35" cy="45" rx="20" ry="15" fill="#D2691E" />

        {/* 头部 */}
        <circle cx="55" cy="35" r="18" fill="#D2691E" />

        {/* 耳朵 */}
        <ellipse cx="48" cy="22" rx="6" ry="12" fill="#8B4513" />
        <ellipse cx="62" cy="22" rx="6" ry="12" fill="#8B4513" />

        {/* 眼睛 */}
        <circle cx="52" cy="32" r="3" fill="#000" />
        <circle cx="52" cy="32" r="1" fill="#fff" className={mood === 'excited' ? 'animate-ping' : ''} />

        {/* 鼻子 */}
        <circle cx="60" cy="38" r="3" fill="#000" />

        {/* 嘴巴 */}
        <path
          d={mood === 'excited' || mood === 'playful' ? 'M58 40 Q60 45, 62 40' : 'M58 40 Q60 42, 62 40'}
          stroke="#000"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* 腿 */}
        <rect x="25" y="55" width="5" height="12" rx="2" fill="#8B4513" className={state === 'walking' ? 'animate-[walk_0.4s_ease-in-out_infinite]' : ''} />
        <rect x="35" y="55" width="5" height="12" rx="2" fill="#8B4513" className={state === 'walking' ? 'animate-[walk_0.4s_ease-in-out_infinite_0.2s]' : ''} />
        <rect x="45" y="55" width="5" height="12" rx="2" fill="#8B4513" className={state === 'running' ? 'animate-[run_0.2s_ease-in-out_infinite]' : ''} />
        <rect x="55" y="55" width="5" height="12" rx="2" fill="#8B4513" className={state === 'running' ? 'animate-[run_0.2s_ease-in-out_infinite_0.1s]' : ''} />

        {/* 心心（兴奋时显示） */}
        {mood === 'excited' && (
          <text x="45" y="10" fontSize="16" className="animate-bounce">❤️</text>
        )}
      </svg>

      {/* 状态提示 */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/70 text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {state === 'idle' && '发呆中...'}
        {state === 'walking' && '散步中~'}
        {state === 'running' && '追你！'}
        {state === 'sitting' && '坐下了！'}
      </div>

      <style>{`
        @keyframes wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes walk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes run {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
