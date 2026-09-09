import { useState } from 'react'

const bases = [
  { key: 'bin', label: '二进制 (BIN)', prefix: '0b', radix: 2 },
  { key: 'oct', label: '八进制 (OCT)', prefix: '0o', radix: 8 },
  { key: 'dec', label: '十进制 (DEC)', prefix: '', radix: 10 },
  { key: 'hex', label: '十六进制 (HEX)', prefix: '0x', radix: 16 },
]

export default function BaseConverter() {
  const [values, setValues] = useState({ bin: '', oct: '', dec: '', hex: '' })
  const [error, setError] = useState('')

  const convert = (input: string, fromRadix: number) => {
    setError('')
    if (!input.trim()) { setValues({ bin: '', oct: '', dec: '', hex: '' }); return }
    try {
      const num = parseInt(input, fromRadix)
      if (isNaN(num)) { setError('输入无效'); return }
      setValues({
        bin: num.toString(2),
        oct: num.toString(8),
        dec: num.toString(10),
        hex: num.toString(16).toUpperCase(),
      })
    } catch { setError('输入无效') }
  }

  return (
    <div className="space-y-3">
      {bases.map((b) => (
        <div key={b.key} className="flex items-center gap-3">
          <label className="w-28 text-xs font-bold text-ink-200 dark:text-ink-inverted/60 shrink-0">{b.label}</label>
          <input
            type="text"
            value={values[b.key as keyof typeof values]}
            onChange={(e) => convert(e.target.value, b.radix)}
            placeholder={`输入${b.label.split(' ')[0]}...`}
            className="flex-1 px-3 py-2 rounded-lg bg-surface-200/60 dark:bg-surface-800/60 border border-black/5 dark:border-white/5 text-sm font-mono text-ink-100 dark:text-ink-inverted focus:outline-none focus:ring-2 focus:ring-accent-400/50"
          />
        </div>
      ))}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
