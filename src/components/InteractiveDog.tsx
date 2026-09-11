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
        const maxX = window.innerWidth - 120
        const maxY = window.innerHeight - 120
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
      targetRef.current = { x: e.clientX - 60, y: e.clientY - 60 }
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
      {/* 可爱柴犬小狗 */}
      <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-2xl">
        <defs>
          {/* 渐变 */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFB347', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FF9E2C', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="noseGradient">
            <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 1 }} />
          </radialGradient>
        </defs>

        {/* 尾巴 */}
        <g className={state === 'walking' || state === 'running' || mood === 'excited' ? 'origin-[20px_55px]' : ''}>
          <path
            d="M15 55 Q8 45, 10 30 Q12 20, 18 18"
            stroke="#FF9E2C"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={state === 'walking' || state === 'running' || mood === 'excited' ? 'animate-wag' : ''}
          />
          <circle cx="18" cy="18" r="8" fill="#FFB347" />
        </g>

        {/* 身体 */}
        <ellipse cx="45" cy="65" rx="28" ry="22" fill="url(#bodyGradient)" />

        {/* 胸部白色 */}
        <ellipse cx="48" cy="68" rx="15" ry="12" fill="#FFF8E7" opacity="0.9" />

        {/* 头部 */}
        <circle cx="75" cy="50" r="25" fill="url(#bodyGradient)" />

        {/* 脸部白色区域 */}
        <ellipse cx="78" cy="55" rx="16" ry="14" fill="#FFF8E7" />

        {/* 左耳 */}
        <ellipse
          cx="62"
          cy="32"
          rx="10"
          ry="16"
          fill="#FF9E2C"
          transform="rotate(-25 62 32)"
          className={mood === 'excited' ? 'animate-bounce' : ''}
        />

        {/* 右耳 */}
        <ellipse
          cx="88"
          cy="32"
          rx="10"
          ry="16"
          fill="#FF9E2C"
          transform="rotate(25 88 32)"
          className={mood === 'excited' ? 'animate-bounce' : ''}
        />

        {/* 左眼 */}
        <g>
          <ellipse cx="68" cy="48" rx="4" ry="5" fill="#000" />
          <circle cx="69" cy="47" r="1.5" fill="#fff" className={mood === 'excited' ? 'animate-ping' : ''} />
        </g>

        {/* 右眼 */}
        <g>
          <ellipse cx="83" cy="48" rx="4" ry="5" fill="#000" />
          <circle cx="84" cy="47" r="1.5" fill="#fff" className={mood === 'excited' ? 'animate-ping' : ''} />
        </g>

        {/* 鼻子 */}
        <ellipse cx="75" cy="58" rx="4" ry="3" fill="url(#noseGradient)" />
        <ellipse cx="74" cy="57" rx="1.5" ry="1" fill="#fff" opacity="0.6" />

        {/* 嘴巴 */}
        <path
          d={mood === 'excited' || mood === 'playful' ? 'M75 59 L72 62 Q75 65, 78 62 Z' : 'M75 59 L72 61 Q75 62, 78 61'}
          fill={mood === 'excited' || mood === 'playful' ? '#FF6B9D' : 'none'}
          stroke="#000"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {(mood === 'excited' || mood === 'playful') && (
          <ellipse cx="75" cy="63" rx="2" ry="1.5" fill="#FF8FAB" />
        )}

        {/* 左前腿 */}
        <rect
          x="35"
          y="80"
          width="8"
          height="20"
          rx="4"
          fill="#FF9E2C"
          className={state === 'walking' ? 'animate-walk-leg' : state === 'running' ? 'animate-run-leg' : ''}
        />
        <ellipse cx="39" cy="100" rx="5" ry="3" fill="#FFF8E7" />

        {/* 右前腿 */}
        <rect
          x="48"
          y="80"
          width="8"
          height="20"
          rx="4"
          fill="#FFB347"
          className={state === 'walking' ? 'animate-walk-leg-delay' : state === 'running' ? 'animate-run-leg-delay' : ''}
        />
        <ellipse cx="52" cy="100" rx="5" ry="3" fill="#FFF8E7" />

        {/* 左后腿 */}
        <rect
          x="58"
          y="80"
          width="8"
          height="20"
          rx="4"
          fill="#FF9E2C"
          className={state === 'walking' ? 'animate-walk-leg-delay' : state === 'running' ? 'animate-run-leg-delay' : ''}
        />
        <ellipse cx="62" cy="100" rx="5" ry="3" fill="#FFF8E7" />

        {/* 右后腿 */}
        <rect
          x="71"
          y="80"
          width="8"
          height="20"
          rx="4"
          fill="#FFB347"
          className={state === 'walking' ? 'animate-walk-leg' : state === 'running' ? 'animate-run-leg' : ''}
        />
        <ellipse cx="75" cy="100" rx="5" ry="3" fill="#FFF8E7" />

        {/* 兴奋时的爱心 */}
        {mood === 'excited' && (
          <>
            <text x="50" y="25" fontSize="20" className="animate-float">❤️</text>
            <text x="85" y="20" fontSize="16" className="animate-float-delay">❤️</text>
          </>
        )}

        {/* 玩耍时的星星 */}
        {mood === 'playful' && (
          <>
            <text x="45" y="30" fontSize="18" className="animate-spin-slow">✨</text>
            <text x="90" y="25" fontSize="18" className="animate-spin-slow-delay">✨</text>
          </>
        )}
      </svg>

      <style>{`
        @keyframes wag {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        @keyframes walk-leg {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes run-leg {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-15px) scale(1.2); opacity: 0.8; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-wag {
          animation: wag 0.4s ease-in-out infinite;
        }
        .animate-walk-leg {
          animation: walk-leg 0.6s ease-in-out infinite;
        }
        .animate-walk-leg-delay {
          animation: walk-leg 0.6s ease-in-out infinite 0.3s;
        }
        .animate-run-leg {
          animation: run-leg 0.3s ease-in-out infinite;
        }
        .animate-run-leg-delay {
          animation: run-leg 0.3s ease-in-out infinite 0.15s;
        }
        .animate-float {
          animation: float 1s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 1s ease-in-out infinite 0.3s;
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-spin-slow-delay {
          animation: spin-slow 2s linear infinite 0.5s;
        }
      `}</style>
    </div>
  )
}
