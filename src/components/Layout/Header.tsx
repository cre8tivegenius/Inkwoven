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
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Inkwoven</h1>
      <div className="flex items-center gap-2">
        {hasProject && (
          <>
            <button
              onClick={onToggleCharacters}
              className={`p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                charactersOpen ? 'bg-primary-100 dark:bg-primary-900/20' : ''
              }`}
              aria-label="Toggle Characters"
            >
              <Users className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
            <button
              onClick={onToggleWorlds}
              className={`p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                worldsOpen ? 'bg-primary-100 dark:bg-primary-900/20' : ''
              }`}
              aria-label="Toggle Worlds"
            >
              <Globe className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          </>
        )}
        <button
          onClick={onToggleImages}
          className={`p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
            imagesOpen ? 'bg-primary-100 dark:bg-primary-900/20' : ''
          }`}
          aria-label="Toggle Image Gallery"
        >
          <Image className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        </button>
        <button
          onClick={onToggleAI}
          className={`p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
            aiOpen ? 'bg-primary-100 dark:bg-primary-900/20' : ''
          }`}
          aria-label="Toggle AI Assistant"
        >
          <Bot className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
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

