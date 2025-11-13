import { useState } from 'react'
import { Palette } from 'lucide-react'

interface ColorPickerProps {
  label: string
  value?: string
  onChange: (color: string) => void
}

const PRESET_COLORS = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
  '#FF0000', '#FF6600', '#FFCC00', '#66FF00', '#00FF66',
  '#00CCFF', '#0066FF', '#6600FF', '#CC00FF', '#FF00CC',
]

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
        title={label}
      >
        <Palette className="w-4 h-4" />
        <div
          className="w-4 h-4 rounded border border-neutral-300 dark:border-neutral-600"
          style={{ backgroundColor: value || '#000000' }}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-20 p-3">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color)
                    setIsOpen(false)
                  }}
                  className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </>
      )}
    </div>
  )
}

