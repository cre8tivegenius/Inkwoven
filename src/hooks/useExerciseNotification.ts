import { useEffect, useState } from 'react'
import { exerciseService } from '@/db/database'

export function useExerciseNotification() {
  const [showNotification, setShowNotification] = useState(false)
  const [hasShownToday, setHasShownToday] = useState(false)

  useEffect(() => {
    const checkTodayExercise = async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const exercises = await exerciseService.getAll()
      const todayExercise = exercises.find((ex) => {
        if (!ex.completedAt) return false
        const completedDate = new Date(ex.completedAt)
        completedDate.setHours(0, 0, 0, 0)
        return completedDate.getTime() === today.getTime()
      })

      if (!todayExercise) {
        // Check if we should show notification (e.g., first visit of the day)
        const lastShown = localStorage.getItem('exercise-notification-last-shown')
        if (!lastShown) {
          setShowNotification(true)
        } else {
          const lastShownDate = new Date(lastShown)
          lastShownDate.setHours(0, 0, 0, 0)
          if (lastShownDate.getTime() !== today.getTime()) {
            setShowNotification(true)
          }
        }
      } else {
        setHasShownToday(true)
      }
    }

    checkTodayExercise()
  }, [])

  const dismissNotification = () => {
    setShowNotification(false)
    localStorage.setItem('exercise-notification-last-shown', new Date().toISOString())
  }

  return { showNotification, hasShownToday, dismissNotification }
}

