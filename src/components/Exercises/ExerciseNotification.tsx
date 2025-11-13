import { Sparkles, X } from 'lucide-react'

interface ExerciseNotificationProps {
  onStart: () => void
  onDismiss: () => void
}

export function ExerciseNotification({ onStart, onDismiss }: ExerciseNotificationProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-slide-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
            Morning Exercise
          </h3>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        Start your writing day with a creative warm-up exercise!
      </p>
      <div className="flex gap-2">
        <button
          onClick={onStart}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
        >
          Start Exercise
        </button>
        <button
          onClick={onDismiss}
          className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          Later
        </button>
      </div>
    </div>
  )
}

