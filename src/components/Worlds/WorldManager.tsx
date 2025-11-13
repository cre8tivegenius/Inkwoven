import { useEffect, useState } from 'react'
import { Globe, Plus, X } from 'lucide-react'
import { worldService } from '@/db/database'
import type { World } from '@/types'

interface WorldManagerProps {
  projectId: string | null
  isOpen: boolean
  onClose: () => void
}

export function WorldManager({ projectId, isOpen, onClose }: WorldManagerProps) {
  const [worlds, setWorlds] = useState<World[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    notes: '',
  })

  useEffect(() => {
    if (isOpen && projectId) {
      loadWorlds()
    }
  }, [isOpen, projectId])

  const loadWorlds = async () => {
    if (!projectId) return
    const w = await worldService.getAll(projectId)
    setWorlds(w)
  }

  const handleCreate = async () => {
    if (!projectId || !formData.name.trim()) return

    await worldService.create({
      projectId,
      name: formData.name,
      description: formData.description,
      notes: { content: formData.notes },
    })

    setFormData({ name: '', description: '', notes: '' })
    setIsCreating(false)
    await loadWorlds()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this world?')) {
      await worldService.delete(id)
      await loadWorlds()
    }
  }

  if (!isOpen || !projectId) return null

  return (
    <div className="w-80 border-l border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Worlds
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isCreating && (
          <div className="mb-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <input
              type="text"
              placeholder="World name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-2 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mb-2 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 h-20 resize-none"
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full mb-2 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 h-32 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 px-3 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setFormData({ name: '', description: '', notes: '' })
                }}
                className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {worlds.map((world) => (
          <div
            key={world.id}
            className="mb-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              {world.name}
            </h3>
            {world.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                {world.description}
              </p>
            )}
            {world.notes && typeof world.notes === 'object' && world.notes.content && (
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                {String(world.notes.content)}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDelete(world.id)}
                className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {worlds.length === 0 && !isCreating && (
          <div className="text-center text-sm text-neutral-500 mt-8">
            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No worlds yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

