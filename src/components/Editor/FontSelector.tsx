import { useState } from 'react'
import { Font } from 'lucide-react'

const GOOGLE_FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lora', value: 'Lora, serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
  { name: 'Roboto Slab', value: '"Roboto Slab", serif' },
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
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
        title="Font Family"
      >
        <Font className="w-4 h-4" />
        <span className="text-sm">{selectedFont.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-20 min-w-[200px] max-h-64 overflow-y-auto">
            {GOOGLE_FONTS.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  onChange(font.value)
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
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

