import { useState, useEffect } from 'react'
import { X, Sparkles, Check } from 'lucide-react'
import { getRandomExercise, type ExercisePrompt } from '@/lib/exercises'
import { exerciseService } from '@/db/database'

interface ExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function ExerciseModal({ isOpen, onClose, onComplete }: ExerciseModalProps) {
  const [exercise, setExercise] = useState<ExercisePrompt | null>(null)
  const [response, setResponse] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setExercise(getRandomExercise())
      setResponse('')
      setIsCompleted(false)
    }
  }, [isOpen])

  const handleComplete = async () => {
    if (!exercise || !response.trim()) return

    await exerciseService.create({
      type: exercise.type,
      prompt: exercise.prompt,
      completed: true,
      completedAt: new Date(),
    })

    setIsCompleted(true)
    setTimeout(() => {
      onComplete()
      onClose()
    }, 1500)
  }

  const handleNewExercise = () => {
    setExercise(getRandomExercise())
    setResponse('')
    setIsCompleted(false)
  }

  if (!isOpen || !exercise) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                Morning Exercise
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 rounded">
                {exercise.category}
              </span>
            </div>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
              {exercise.prompt}
            </p>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write your response here..."
              className="w-full h-64 p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={handleNewExercise}
              className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
            >
              New Exercise
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Skip
              </button>
              <button
                onClick={handleComplete}
                disabled={!response.trim() || isCompleted}
                className={`px-4 py-2 text-sm rounded flex items-center gap-2 ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
                }`}
              >
                {isCompleted ? (
                  <>
                    <Check className="w-4 h-4" />
                    Completed!
                  </>
                ) : (
                  'Complete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

