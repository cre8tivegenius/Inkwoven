import type { ReactNode } from 'react'

interface MainProps {
  children: ReactNode
}

export function Main({ children }: MainProps) {
  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full glass-panel p-0 overflow-hidden">
        {children}
      </div>
    </main>
  )
}

