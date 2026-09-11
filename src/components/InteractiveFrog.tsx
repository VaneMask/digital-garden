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
      {/* 可爱奶蛙 */}
      <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-2xl">
        <defs>
          {/* 身体渐变 */}
          <radialGradient id="bodyGradient">
            <stop offset="0%" style={{ stopColor: '#F5F5DC', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#E8E8D0', stopOpacity: 1 }} />
          </radialGradient>
          {/* 腮红渐变 */}
          <radialGradient id="blushGradient">
            <stop offset="0%" style={{ stopColor: '#FFB6C1', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#FFB6C1', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* 影子 */}
        <ellipse cx="75" cy="130" rx="50" ry="10" fill="#000" opacity="0.15" />

        {/* 后腿 */}
        <ellipse cx="45" cy="105" rx="22" ry="18" fill="#D8D8C0" />
        <ellipse cx="105" cy="105" rx="22" ry="18" fill="#D8D8C0" />

        {/* 后脚 */}
        <ellipse cx="30" cy="120" rx="18" ry="12" fill="#C8C8B0" transform="rotate(-20 30 120)" />
        <ellipse cx="120" cy="120" rx="18" ry="12" fill="#C8C8B0" transform="rotate(20 120 120)" />

        {/* 主体 - 圆滚滚的身体 */}
        <ellipse cx="75" cy="75" rx="55" ry="50" fill="url(#bodyGradient)" />

        {/* 肚子白斑 */}
        <ellipse cx="75" cy="85" rx="35" ry="30" fill="#FFF" opacity="0.6" />

        {/* 前腿 */}
        <ellipse cx="50" cy="90" rx="15" ry="20" fill="#E8E8D0" />
        <ellipse cx="100" cy="90" rx="15" ry="20" fill="#E8E8D0" />

        {/* 前脚 */}
        <ellipse cx="42" cy="108" rx="12" ry="8" fill="#D8D8C0" transform="rotate(-10 42 108)" />
        <ellipse cx="108" cy="108" rx="12" ry="8" fill="#D8D8C0" transform="rotate(10 108 108)" />

        {/* 眼睛底座 */}
        <circle cx="55" cy="55" r="20" fill="#FFF" />
        <circle cx="95" cy="55" r="20" fill="#FFF" />

        {/* 眼睛外圈 */}
        <circle cx="55" cy="55" r="18" fill="#000" opacity="0.8" />
        <circle cx="95" cy="55" r="18" fill="#000" opacity="0.8" />

        {/* 眼睛 - 大眼睛特效 */}
        <circle cx="55" cy="55" r="14" fill="#2C2C2C" />
        <circle cx="95" cy="55" r="14" fill="#2C2C2C" />

        {/* 眼睛高光 */}
        <circle cx="58" cy="50" r="6" fill="#FFF" className={mood === 'excited' ? 'animate-pulse' : ''} />
        <circle cx="98" cy="50" r="6" fill="#FFF" className={mood === 'excited' ? 'animate-pulse' : ''} />
        <circle cx="52" cy="58" r="3" fill="#FFF" opacity="0.7" />
        <circle cx="92" cy="58" r="3" fill="#FFF" opacity="0.7" />

        {/* 腮红 */}
        <ellipse
          cx="35"
          cy="70"
          rx="12"
          ry="8"
          fill="url(#blushGradient)"
          className={mood === 'happy' || mood === 'excited' ? 'opacity-100' : 'opacity-60'}
        />
        <ellipse
          cx="115"
          cy="70"
          rx="12"
          ry="8"
          fill="url(#blushGradient)"
          className={mood === 'happy' || mood === 'excited' ? 'opacity-100' : 'opacity-60'}
        />

        {/* 嘴巴 */}
        <path
          d={mood === 'excited' || mood === 'happy'
            ? 'M65 78 Q75 85, 85 78'
            : 'M65 78 Q75 80, 85 78'}
          stroke="#000"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* 舌头（兴奋时） */}
        {mood === 'excited' && (
          <ellipse cx="75" cy="82" rx="8" ry="5" fill="#FF6B9D" />
        )}

        {/* 鼻孔 */}
        <circle cx="70" cy="70" r="2" fill="#000" opacity="0.4" />
        <circle cx="80" cy="70" r="2" fill="#000" opacity="0.4" />

        {/* 呱呱气泡（兴奋时） */}
        {mood === 'excited' && (
          <>
            <circle cx="120" cy="40" r="15" fill="#FFF" opacity="0.9" className="animate-ping" />
            <text x="110" y="46" fontSize="14" fill="#000" className="font-bold">呱!</text>
          </>
        )}

        {/* 爱心（开心时） */}
        {mood === 'happy' && (
          <>
            <text x="20" y="35" fontSize="20" className="animate-bounce">💕</text>
            <text x="120" y="30" fontSize="16" className="animate-bounce delay-100">💕</text>
          </>
        )}

        {/* 跳跃运动线 */}
        {state === 'jumping' && (
          <>
            <path d="M30 100 Q25 90, 28 80" stroke="#000" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
            <path d="M120 100 Q125 90, 122 80" stroke="#000" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
          </>
        )}
      </svg>

      <style>{`
        .delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  )
}
