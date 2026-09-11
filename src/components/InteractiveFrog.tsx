import { useState, useEffect, useRef } from 'react'

export default function InteractiveFrog() {
  const [position, setPosition] = useState({ x: 150, y: 150 })
  const [state, setState] = useState<'idle' | 'walking' | 'waving'>('idle')
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const frogRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: 150, y: 150 })

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

    const interval = setInterval(randomMove, 5000)
    return () => clearInterval(interval)
  }, [state])

  // 移动逻辑
  useEffect(() => {
    if (state === 'walking') {
      const interval = setInterval(() => {
        const dx = targetRef.current.x - position.x
        const dy = targetRef.current.y - position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 5) {
          setDirection(dx > 0 ? 'right' : 'left')
          const speed = 1.5
          const ratio = speed / distance
          setPosition(prev => ({
            x: prev.x + dx * ratio,
            y: prev.y + dy * ratio
          }))
        } else {
          setState('idle')
        }
      }, 20)
      return () => clearInterval(interval)
    }
  }, [position, state])

  // 点击互动 - 挥手
  const handleClick = () => {
    setState('waving')
    setTimeout(() => setState('idle'), 2000)
  }

  return (
    <div
      ref={frogRef}
      onClick={handleClick}
      className="fixed z-50 cursor-pointer select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scaleX(${direction === 'left' ? -1 : 1})`,
        transition: 'left 0.02s, top 0.02s'
      }}
      title="点击奶蛙互动！"
    >
      {/* 奶蛙容器 - 使用CSS分层模拟肢体动作 */}
      <div className="relative w-48 h-48">
        {/* 影子 */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black rounded-full blur-lg"
          style={{
            width: '100px',
            height: '15px',
            opacity: 0.2
          }}
        />

        {/* 主体图片 - 作为背景层 */}
        <div className="absolute inset-0">
          <img
            src="/images/naiwa-transparent.png"
            alt="奶蛙"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* 左臂覆盖层 - 模拟手臂动画 */}
        <div
          className="absolute left-[15%] top-[35%] w-[20%] h-[25%] origin-right"
          style={{
            animation: state === 'walking'
              ? 'swing-left-arm 0.6s ease-in-out infinite'
              : state === 'waving'
              ? 'wave-arm 0.5s ease-in-out infinite'
              : 'breathe-arm 3s ease-in-out infinite'
          }}
        >
          {/* 使用渐变遮罩模拟手臂 */}
          <div className="w-full h-full" style={{
            background: 'radial-gradient(ellipse at center, rgba(255,220,100,0) 0%, rgba(255,220,100,0) 100%)',
          }}></div>
        </div>

        {/* 右臂覆盖层 */}
        <div
          className="absolute right-[15%] top-[35%] w-[20%] h-[25%] origin-left"
          style={{
            animation: state === 'walking'
              ? 'swing-right-arm 0.6s ease-in-out infinite'
              : state === 'waving'
              ? 'wave-arm 0.5s ease-in-out infinite 0.25s'
              : 'breathe-arm 3s ease-in-out infinite 0.3s'
          }}
        >
          <div className="w-full h-full"></div>
        </div>

        {/* 身体呼吸效果 */}
        {state === 'idle' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              animation: 'body-breathe 3s ease-in-out infinite'
            }}
          />
        )}

        {/* 行走时的弹跳 */}
        {state === 'walking' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              animation: 'body-bounce 0.6s ease-in-out infinite'
            }}
          />
        )}

        {/* 挥手气泡 */}
        {state === 'waving' && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-xl animate-bounce border-2 border-yellow-300">
            <span className="text-xl font-bold text-yellow-600">👋 嗨！</span>
          </div>
        )}
      </div>

      <style>{`
        /* 手臂摆动动画 - 行走时 */
        @keyframes swing-left-arm {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes swing-right-arm {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
        }

        /* 挥手动画 */
        @keyframes wave-arm {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-30deg); }
          75% { transform: rotate(30deg); }
        }

        /* 呼吸时手臂微动 */
        @keyframes breathe-arm {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(2deg) translateY(-2px); }
        }

        /* 身体呼吸 */
        @keyframes body-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02) translateY(-2px); }
        }

        /* 行走弹跳 */
        @keyframes body-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
