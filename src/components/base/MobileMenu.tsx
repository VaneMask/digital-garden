import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type PanInfo } from 'framer-motion'

const NAV_LINKS = [
  { name: '首页', href: '/' },
  { name: '项目', href: '/projects' },
  { name: '工具', href: '/tools' },
  { name: '归档', href: '/archive' },
  { name: '照片墙', href: '/photos' },
  { name: '说说', href: '/moments' },
  { name: '关于', href: '/about' },
]

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [dragConstraints, setDragConstraints] = useState({ top: 0, bottom: 0 })
  const dragY = useMotionValue(0)

  // Wheel rotation physics
  const wheelRef = useRef<HTMLDivElement>(null)
  const rawRotation = useMotionValue(0)
  const smoothRotation = useSpring(rawRotation, { stiffness: 200, damping: 25 })
  const inverseRotation = useTransform(smoothRotation, (r) => -r)

  // Calculate drag constraints based on viewport
  useEffect(() => {
    const updateConstraints = () => {
      const vh = window.innerHeight
      setDragConstraints({ top: -(vh / 2) + 80, bottom: vh / 2 - 80 })
    }
    updateConstraints()
    window.addEventListener('resize', updateConstraints)
    return () => window.removeEventListener('resize', updateConstraints)
  }, [])

  // Reset rotation when menu opens
  useEffect(() => {
    if (isOpen) rawRotation.set(0)
  }, [isOpen, rawRotation])

  // Theme toggle
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [isOpen])
  const toggleTheme = useCallback(() => {
    const html = document.documentElement
    const next = !html.classList.contains('dark')
    html.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setIsDark(next)
  }, [])

  // Detect current page for active state
  const [currentPath, setCurrentPath] = useState('/')
  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [isOpen])

  // Handle wheel pan (rotation)
  const handlePan = (_: any, info: PanInfo) => {
    if (!wheelRef.current) return
    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const prevAngle = Math.atan2(
      info.point.y - info.delta.y - centerY,
      info.point.x - info.delta.x - centerX
    )
    const currAngle = Math.atan2(info.point.y - centerY, info.point.x - centerX)
    let deltaAngle = (currAngle - prevAngle) * (180 / Math.PI)
    if (deltaAngle > 180) deltaAngle -= 360
    if (deltaAngle < -180) deltaAngle += 360
    rawRotation.set(rawRotation.get() + deltaAngle)
  }

  return (
    <div className="md:hidden">
      {/* Floating trigger ball */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            drag="y"
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            dragMomentum={false}
            style={{ y: dragY }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            onClick={() => {
              if (Math.abs(dragY.getVelocity()) < 10) {
                setIsOpen(true)
              }
            }}
            className="fixed top-1/2 right-0 -translate-y-1/2 w-12 h-28 bg-gradient-to-b from-rose-400 via-accent-400 to-sky-400 backdrop-blur-xl rounded-l-full shadow-[-5px_0_20px_rgba(244,114,158,0.5)] z-[60] flex items-center justify-center border-y border-l border-white/30 touch-none"
          >
            <div className="flex flex-col gap-1.5 items-center justify-center mr-2">
              <div className="w-1.5 h-1.5 bg-white/90 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/90 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white/90 rounded-full" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fullscreen wheel menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-gradient-to-br from-rose-950/40 via-slate-950/50 to-sky-950/40 backdrop-blur-xl z-[65]"
            />

            {/* Wheel */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] z-[70]"
            >
              <motion.div
                ref={wheelRef}
                style={{ rotate: smoothRotation }}
                onPan={handlePan}
                className="w-full h-full rounded-full border border-white/40 dark:border-white/[0.06] bg-white/20 dark:bg-white/[0.03] backdrop-blur-3xl shadow-[0_0_80px_rgba(244,114,158,0.12),0_0_30px_rgba(56,189,248,0.08)] relative cursor-grab active:cursor-grabbing touch-none"
              >
                {/* Center close button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border-2 border-white/50 dark:border-white/10 flex items-center justify-center shadow-lg z-10">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 via-accent-400 to-sky-400 flex items-center justify-center text-white font-black shadow-lg shadow-rose-400/30 hover:shadow-rose-400/50 hover:rotate-90 transition-all duration-300 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Menu items arranged in a circle */}
                {NAV_LINKS.map((link, index) => {
                  const isActive = currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href))
                  const angle = index * (360 / NAV_LINKS.length)

                  return (
                    <div
                      key={link.href}
                      className="absolute top-1/2 left-1/2 w-14 h-14 -ml-7 -mt-7 flex items-center justify-center"
                      style={{
                        transform: `rotate(${angle}deg) translateY(-115px) rotate(${-angle}deg)`,
                      }}
                    >
                      <motion.div style={{ rotate: inverseRotation }} className="w-full h-full">
                        <a
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-center w-full h-full rounded-full transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-br from-rose-400 via-accent-400 to-sky-400 text-white shadow-[0_0_20px_rgba(244,114,158,0.5)] scale-110'
                              : 'bg-white/30 dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-md hover:scale-110 border border-white/50 dark:border-white/[0.08] hover:border-rose-300/60 dark:hover:border-rose-400/25 hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-xl hover:shadow-rose-300/25 dark:hover:shadow-rose-500/10'
                          }`}
                        >
                          <span className="text-[11px] font-black">{link.name}</span>
                        </a>
                      </motion.div>
                    </div>
                  )
                })}
              </motion.div>

              {/* Theme toggle below the wheel */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                onClick={toggleTheme}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/25 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/[0.06] shadow-lg flex items-center justify-center text-slate-500 dark:text-slate-300 hover:scale-110 hover:bg-white/40 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
