import { Moon, Sun, Bot, Image, Users, Globe } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'

interface HeaderProps {
  onToggleAI: () => void
  aiOpen: boolean
  onToggleImages: () => void
  imagesOpen: boolean
  onToggleCharacters: () => void
  charactersOpen: boolean
  onToggleWorlds: () => void
  worldsOpen: boolean
  hasProject: boolean
}

export function Header({
  onToggleAI,
  aiOpen,
  onToggleImages,
  imagesOpen,
  onToggleCharacters,
  charactersOpen,
  onToggleWorlds,
  worldsOpen,
  hasProject,
}: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="mx-6 my-4 h-20 glass-panel flex items-center justify-between px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-300">
          Story studio
        </p>
        <h1 className="text-3xl font-semibold font-display text-neutral-900 dark:text-neutral-50">
          Inkwoven
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {hasProject && (
          <>
            <button
              onClick={onToggleCharacters}
              className={`p-2.5 rounded-2xl border border-transparent transition-all hover:border-primary-200 hover:bg-white/60 dark:hover:bg-neutral-800/70 ${
                charactersOpen ? 'bg-primary-100/80 dark:bg-primary-900/30 border-primary-200' : ''
              }`}
              aria-label="Toggle Characters"
            >
              <Users className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
            <button
              onClick={onToggleWorlds}
              className={`p-2.5 rounded-2xl border border-transparent transition-all hover:border-primary-200 hover:bg-white/60 dark:hover:bg-neutral-800/70 ${
                worldsOpen ? 'bg-primary-100/80 dark:bg-primary-900/30 border-primary-200' : ''
              }`}
              aria-label="Toggle Worlds"
            >
              <Globe className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          </>
        )}
        <button
          onClick={onToggleImages}
          className={`p-2.5 rounded-2xl border border-transparent transition-all hover:border-primary-200 hover:bg-white/60 dark:hover:bg-neutral-800/70 ${
            imagesOpen ? 'bg-primary-100/80 dark:bg-primary-900/30 border-primary-200' : ''
          }`}
          aria-label="Toggle Image Gallery"
        >
          <Image className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        </button>
        <button
          onClick={onToggleAI}
          className={`p-2.5 rounded-2xl border border-transparent transition-all hover:border-primary-200 hover:bg-white/60 dark:hover:bg-neutral-800/70 ${
            aiOpen ? 'bg-primary-100/80 dark:bg-primary-900/30 border-primary-200' : ''
          }`}
          aria-label="Toggle AI Assistant"
        >
          <Bot className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl border border-transparent hover:border-primary-200 hover:bg-white/60 dark:hover:bg-neutral-800/70 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          )}
        </button>
      </div>
    </header>
  )
}

