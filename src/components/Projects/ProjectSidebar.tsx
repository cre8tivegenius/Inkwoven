import { useEffect, useState } from 'react'
import { Folder, Plus, Search, X } from 'lucide-react'
import { projectService } from '@/db/database'
import type { Project } from '@/types'

interface ProjectSidebarProps {
  selectedProjectId: string | null
  onSelectProject: (projectId: string | null) => void
}

export function ProjectSidebar({ selectedProjectId, onSelectProject }: ProjectSidebarProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    let isMounted = true
    const fetchProjects = async () => {
      const allProjects = await projectService.getAll()
      if (isMounted) {
        setProjects(allProjects)
      }
    }
    fetchProjects()
    return () => {
      isMounted = false
    }
  }, [])

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    const id = await projectService.create(newProjectName.trim())
    const allProjects = await projectService.getAll()
    setProjects(allProjects)
    setNewProjectName('')
    setIsCreating(false)
    onSelectProject(id)
  }

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project? All documents will be deleted.')) {
      await projectService.delete(id)
      const allProjects = await projectService.getAll()
      setProjects(allProjects)
      if (selectedProjectId === id) {
        onSelectProject(null)
      }
    }
  }

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-64 glass-panel flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-white/30 dark:border-neutral-800/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold font-display text-neutral-900 dark:text-neutral-50">Projects</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="p-1.5 rounded-xl border border-transparent hover:border-primary-200 hover:bg-white/70 dark:hover:bg-neutral-800/70"
            title="New Project"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isCreating && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateProject()
                if (e.key === 'Escape') {
                  setIsCreating(false)
                  setNewProjectName('')
                }
              }}
              placeholder="Project name"
              className="flex-1 px-3 py-1.5 text-sm border border-white/40 dark:border-neutral-700/70 rounded-xl bg-white/80 dark:bg-neutral-900/60 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              autoFocus
            />
            <button
              onClick={handleCreateProject}
              className="px-3 py-1.5 text-sm rounded-xl bg-primary-600 text-white hover:bg-primary-500 shadow shadow-primary-900/20"
            >
              Create
            </button>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-white/40 dark:border-neutral-700/70 rounded-2xl bg-white/70 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-300"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => onSelectProject(null)}
          className={`w-full text-left px-4 py-2.5 flex items-center gap-2 rounded-2xl mx-2 mt-3 transition-colors ${
            selectedProjectId === null
              ? 'bg-primary-100/70 text-neutral-900'
              : 'hover:bg-white/60 dark:hover:bg-neutral-800/60'
          }`}
        >
          <Folder className="w-4 h-4 text-primary-700" />
          <span className="text-sm font-medium">All Documents</span>
        </button>

        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`group flex items-center justify-between px-4 py-2.5 mx-2 mt-2 rounded-2xl cursor-pointer transition-colors ${
              selectedProjectId === project.id
                ? 'bg-primary-100/70 text-neutral-900'
                : 'hover:bg-white/60 dark:hover:bg-neutral-800/60'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Folder className="w-4 h-4 flex-shrink-0 text-primary-600" />
              <span className="text-sm truncate font-medium">{project.name}</span>
            </div>
            <button
              onClick={(e) => handleDeleteProject(project.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/70 dark:hover:bg-neutral-700"
              title="Delete project"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {filteredProjects.length === 0 && searchQuery && (
          <div className="px-4 py-8 text-center text-sm text-neutral-500">
            No projects found
          </div>
        )}
      </div>
    </div>
  )
}

