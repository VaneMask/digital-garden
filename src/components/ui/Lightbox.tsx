import { useState, useEffect, useCallback } from 'react'

interface PhotoData {
  src: string
  alt: string
  description: string
  camera: string
  lens: string
  iso: string
  aperture: string
  shutter: string
}

export default function Lightbox() {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const triggers = document.querySelectorAll('[data-lightbox-trigger]')
    const items: PhotoData[] = []

    triggers.forEach((trigger) => {
      const img = trigger.querySelector('[data-lightbox-src]') as HTMLImageElement
      if (img) {
        items.push({
          src: img.dataset.lightboxSrc || '',
          alt: img.dataset.lightboxAlt || '',
          description: img.dataset.lightboxDesc || '',
          camera: img.dataset.lightboxCamera || '',
          lens: img.dataset.lightboxLens || '',
          iso: img.dataset.lightboxIso || '',
          aperture: img.dataset.lightboxAperture || '',
          shutter: img.dataset.lightboxShutter || '',
        })
      }
    })

    setPhotos(items)

    const handleClick = (e: Event) => {
      const target = (e.currentTarget as HTMLElement)
      const img = target.querySelector('[data-lightbox-src]') as HTMLImageElement
      if (img) {
        const idx = items.findIndex((p) => p.src === img.dataset.lightboxSrc)
        if (idx !== -1) {
          setCurrentIndex(idx)
          setIsOpen(true)
        }
      }
    }

    triggers.forEach((t) => t.addEventListener('click', handleClick))
    return () => {
      triggers.forEach((t) => t.removeEventListener('click', handleClick))
    }
  }, [])

  const close = useCallback(() => setIsOpen(false), [])
  const prev = useCallback(() => setCurrentIndex((i) => (i > 0 ? i - 1 : photos.length - 1)), [photos.length])
  const next = useCallback(() => setCurrentIndex((i) => (i < photos.length - 1 ? i + 1 : 0)), [photos.length])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, prev, next])

  if (!isOpen || photos.length === 0) return null

  const photo = photos[currentIndex]
  const hasExif = photo.camera || photo.iso || photo.aperture || photo.shutter

  return (
    <div className="lightbox-overlay" onClick={close}>
      {/* Close button */}
      <button
        type="button"
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200 z-10"
        onClick={close}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Nav buttons */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200 z-10"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200 z-10"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Image */}
      <div className="flex flex-col items-center max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-w-full max-h-[75vh] object-contain rounded-xl"
        />

        {/* Info */}
        {(photo.description || hasExif) && (
          <div className="mt-4 text-center">
            {photo.description && (
              <p className="text-white/90 text-sm">{photo.description}</p>
            )}
            {hasExif && (
              <p className="text-white/50 text-xs mt-1">
                {[photo.camera, photo.lens, photo.aperture, photo.shutter, photo.iso ? `ISO ${photo.iso}` : '']
                  .filter(Boolean)
                  .join(' | ')}
              </p>
            )}
          </div>
        )}

        {/* Counter */}
        {photos.length > 1 && (
          <p className="mt-2 text-white/40 text-xs">
            {currentIndex + 1} / {photos.length}
          </p>
        )}
      </div>
    </div>
  )
}
