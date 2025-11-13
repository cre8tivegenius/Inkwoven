import { useState } from 'react'
import { FileText, X } from 'lucide-react'
import { templates, type Template } from '@/lib/templates'

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void
  onClose: () => void
}

export function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Choose a Template
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template)
                  onClose()
                }}
                className="p-6 text-left border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

