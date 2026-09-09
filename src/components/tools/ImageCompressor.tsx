import { useState, useRef } from 'react'

export default function ImageCompressor() {
  const [original, setOriginal] = useState<string>('')
  const [compressed, setCompressed] = useState<string>('')
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [quality, setQuality] = useState(70)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOriginalSize(file.size)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      setOriginal(url)
      compress(url, quality)
    }
    reader.readAsDataURL(file)
  }

  const compress = (dataUrl: string, q: number) => {
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const result = canvas.toDataURL('image/jpeg', q / 100)
      setCompressed(result)
      setCompressedSize(Math.round(result.length * 0.75))
    }
    img.src = dataUrl
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = compressed
    a.download = 'compressed.jpg'
    a.click()
  }

  const ratio = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-center w-full py-6 rounded-lg border-2 border-dashed border-ink-300/20 hover:border-accent-400/50 cursor-pointer transition-colors">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <span className="text-xs text-ink-300/60">点击或拖拽图片到此处</span>
      </label>
      <canvas ref={canvasRef} className="hidden" />
      {original && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-300/60">质量</span>
            <input type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(+e.target.value); if (original) compress(original, +e.target.value) }}
              className="flex-1 accent-accent-500" />
            <span className="text-xs font-mono text-ink-200 w-8">{quality}%</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 rounded-lg bg-surface-200/40 dark:bg-surface-800/40">
              <p className="text-[10px] text-ink-300/50 mb-1">原始</p>
              <p className="text-sm font-bold text-ink-100 dark:text-ink-inverted">{(originalSize / 1024).toFixed(1)} KB</p>
            </div>
            <div className="p-2 rounded-lg bg-surface-200/40 dark:bg-surface-800/40">
              <p className="text-[10px] text-ink-300/50 mb-1">压缩后</p>
              <p className="text-sm font-bold text-accent-500">{(compressedSize / 1024).toFixed(1)} KB <span className="text-green-500">-{ratio}%</span></p>
            </div>
          </div>
          <button onClick={download} className="w-full py-2 rounded-lg bg-accent-500 text-white text-sm font-bold hover:opacity-80 transition-opacity">下载压缩图片</button>
        </div>
      )}
    </div>
  )
}
