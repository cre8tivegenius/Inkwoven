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
    loadProjects()
  }, [])

  const loadProjects = async () => {
    const allProjects = await projectService.getAll()
    setProjects(allProjects)
  }

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    const id = await projectService.create(newProjectName.trim())
    await loadProjects()
    setNewProjectName('')
    setIsCreating(false)
    onSelectProject(id)
  }

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project? All documents will be deleted.')) {
      await projectService.delete(id)
      await loadProjects()
      if (selectedProjectId === id) {
        onSelectProject(null)
      }
    }
  }

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-64 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Projects</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
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
              className="flex-1 px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
              autoFocus
            />
            <button
              onClick={handleCreateProject}
              className="px-2 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Create
            </button>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-8 pr-2 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => onSelectProject(null)}
          className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
            selectedProjectId === null ? 'bg-neutral-100 dark:bg-neutral-700' : ''
          }`}
        >
          <Folder className="w-4 h-4" />
          <span className="text-sm">All Documents</span>
        </button>

        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`group flex items-center justify-between px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer ${
              selectedProjectId === project.id ? 'bg-neutral-100 dark:bg-neutral-700' : ''
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Folder className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{project.name}</span>
            </div>
            <button
              onClick={(e) => handleDeleteProject(project.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600"
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

