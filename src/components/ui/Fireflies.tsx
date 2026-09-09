import { useEffect, useState } from 'react'

interface Firefly {
  id: number
  left: string
  top: string
  size: number
  duration: number
  delay: number
  floatClass: string
}

export default function Fireflies() {
  const [fireflies, setFireflies] = useState<Firefly[]>([])

  useEffect(() => {
    const count = 20
    const items: Firefly[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 4 + Math.random() * 6,
      duration: 4 + Math.random() * 6,
      delay: -(Math.random() * 10),
      floatClass: `float${Math.floor(Math.random() * 4) + 1}`,
    }))
    setFireflies(items)
  }, [])

  if (fireflies.length === 0) return null

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[5] overflow-hidden ">
      <style>{`
        @keyframes fireflyBreathe {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(8vw, -12vh); }
          66% { transform: translate(-4vw, -18vh); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-10vw, 8vh); }
          66% { transform: translate(6vw, 12vh); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(12vw, 10vh); }
          66% { transform: translate(-8vw, 4vh); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-12vw, -8vh); }
          66% { transform: translate(8vw, -12vh); }
        }
      `}</style>
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(249,157,187,0.8) 40%, transparent 70%)',
            boxShadow: '0 0 8px 3px rgba(249,157,187,0.7), 0 0 16px 6px rgba(139,116,247,0.3)',
            animation: `fireflyBreathe ${f.duration}s ease-in-out ${f.delay}s infinite, ${f.floatClass} ${12 + Math.random() * 8}s ease-in-out ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
