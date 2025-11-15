import { useState } from 'react'
import { Type } from 'lucide-react'

const GOOGLE_FONTS = [
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Crimson Pro', value: '"Crimson Pro", serif' },
  { name: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
  { name: 'Spectral', value: '"Spectral", serif' },
  { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
]

interface FontSelectorProps {
  value?: string
  onChange: (font: string) => void
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedFont = GOOGLE_FONTS.find((f) => f.value === value) || GOOGLE_FONTS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-transparent hover:border-primary-200 hover:bg-primary-50/70 dark:hover:bg-neutral-800/60 transition-colors"
        title="Font Family"
      >
        <Type className="w-4 h-4" />
        <span className="text-sm">{selectedFont.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white/90 dark:bg-neutral-900/80 border border-white/40 dark:border-neutral-800/70 rounded-2xl shadow-2xl shadow-neutral-900/10 z-20 min-w-[220px] max-h-64 overflow-y-auto backdrop-blur">
            {GOOGLE_FONTS.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  onChange(font.value)
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-primary-50/70 dark:hover:bg-neutral-800/60 flex items-center gap-2 rounded-xl transition-colors"
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

