import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen() {
  const [show, setShow] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const hasSeen = sessionStorage.getItem('splash-seen') === 'true'

    if (!hasSeen) {
      setShow(true)
      const timer = setTimeout(() => {
        exitSplash()
      }, 2200)
      return () => clearTimeout(timer)
    }
  }, [])

  const exitSplash = () => {
    setShow(false)
    sessionStorage.setItem('splash-seen', 'true')
    setTimeout(() => {
      document.documentElement.classList.add('splash-seen')
    }, 500)
  }

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[var(--color-bg-primary)]"
        >
          <div className="relative z-10 flex flex-col items-center">
            {/* Avatar with rotating glow ring */}
            <div className="relative w-24 h-24 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-[3px]"
              />
              <div className="relative w-full h-full rounded-full p-[3px] bg-white dark:bg-slate-900 shadow-xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">V</span>
                </div>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-black text-[var(--color-text-primary)] mb-2 tracking-[0.2em] uppercase">
              VaneMask
            </h1>
            <p className="text-[10px] font-bold text-[var(--color-text-muted)] tracking-[0.5em] mb-12">
              INITIALIZING GARDEN
            </p>

            {/* Progress bar */}
            <div className="w-40 h-[1.5px] bg-[var(--color-bg-secondary)] relative overflow-hidden rounded-full">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
