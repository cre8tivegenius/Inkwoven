import { useId, useState } from 'react'
import { Palette } from 'lucide-react'

interface ColorPickerProps {
  label: string
  value?: string
  onChange: (color: string) => void
}

const PRESET_COLORS = [
  '#241a15',
  '#3b1f0c',
  '#5c3113',
  '#80461b',
  '#c6822b',
  '#f1d3ac',
  '#8f7760',
  '#574334',
  '#3d9282',
  '#21584c',
  '#f8f0e3',
  '#ffffff',
]

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inputId = useId()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-transparent hover:border-primary-200 hover:bg-primary-50/70 dark:hover:bg-neutral-800/60 transition-colors"
        title={label}
      >
        <Palette className="w-4 h-4" />
        <div
          className="w-4 h-4 rounded border border-white/40 dark:border-neutral-700/70"
          style={{ backgroundColor: value || '#000000' }}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white/90 dark:bg-neutral-900/80 border border-white/40 dark:border-neutral-800/70 rounded-2xl shadow-2xl shadow-neutral-900/10 z-20 p-3 backdrop-blur">
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color)
                    setIsOpen(false)
                  }}
                  className="w-8 h-8 rounded-xl border border-white/40 dark:border-neutral-700/70 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <label htmlFor={inputId} className="sr-only">
              {label}
            </label>
            <input
              id={inputId}
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 rounded-xl cursor-pointer border border-white/40 dark:border-neutral-700/70 bg-transparent"
            />
          </div>
        </>
      )}
    </div>
  )
}

