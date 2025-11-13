import { ReactNode } from 'react'

interface MainProps {
  children: ReactNode
}

export function Main({ children }: MainProps) {
  return (
    <main className="flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      {children}
    </main>
  )
}

