import { useState } from 'react'
import { Download, FileText, File, FileCode, FileType } from 'lucide-react'
import { exportToTxt, exportToMarkdown, exportToPdf, exportToOdf } from '@/lib/export'
import type { Document } from '@/types'

interface ExportMenuProps {
  document: Document
}

export function ExportMenu({ document }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const exportOptions = [
    {
      label: 'Export as TXT',
      icon: FileText,
      action: () => exportToTxt(document),
      extension: '.txt',
    },
    {
      label: 'Export as Markdown',
      icon: FileCode,
      action: () => exportToMarkdown(document),
      extension: '.md',
    },
    {
      label: 'Export as PDF',
      icon: File,
      action: () => exportToPdf(document),
      extension: '.pdf',
    },
    {
      label: 'Export as ODF',
      icon: FileType,
      action: () => exportToOdf(document),
      extension: '.odt',
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
        title="Export"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm">Export</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-20 min-w-[200px]">
            {exportOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.extension}
                  onClick={() => {
                    option.action()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{option.label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

