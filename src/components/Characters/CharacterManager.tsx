import { useEffect, useState } from 'react'
import { Users, Plus, X, Edit2 } from 'lucide-react'
import { characterService } from '@/db/database'
import type { Character } from '@/types'

interface CharacterManagerProps {
  projectId: string | null
  isOpen: boolean
  onClose: () => void
}

export function CharacterManager({ projectId, isOpen, onClose }: CharacterManagerProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    traits: '',
    image: null as File | null,
  })

  useEffect(() => {
    if (isOpen && projectId) {
      loadCharacters()
    }
  }, [isOpen, projectId])

  const loadCharacters = async () => {
    if (!projectId) return
    const chars = await characterService.getAll(projectId)
    setCharacters(chars)
  }

  const handleCreate = async () => {
    if (!projectId || !formData.name.trim()) return

    const traits = formData.traits
      .split('\n')
      .reduce((acc, line) => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length > 0) {
          acc[key.trim()] = valueParts.join(':').trim()
        }
        return acc
      }, {} as Record<string, string>)

    let imageBlob: Blob | undefined
    if (formData.image) {
      imageBlob = new Blob([formData.image], { type: formData.image.type })
    }

    await characterService.create({
      projectId,
      name: formData.name,
      traits,
      image: imageBlob,
    })

    setFormData({ name: '', traits: '', image: null })
    setIsCreating(false)
    await loadCharacters()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this character?')) {
      await characterService.delete(id)
      await loadCharacters()
    }
  }

  if (!isOpen || !projectId) return null

  return (
    <div className="w-80 border-l border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Characters
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
              placeholder="Character name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-2 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
            />
            <textarea
              placeholder="Traits (one per line, format: Key: Value)"
              value={formData.traits}
              onChange={(e) => setFormData({ ...formData, traits: e.target.value })}
              className="w-full mb-2 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 h-24 resize-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files?.[0] || null })
              }
              className="w-full mb-2 text-sm"
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
                  setFormData({ name: '', traits: '', image: null })
                }}
                className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {characters.map((character) => {
          const imageUrl = character.image ? URL.createObjectURL(character.image) : null
          return (
            <div
              key={character.id}
              className="mb-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={character.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                {character.name}
              </h3>
              <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                {Object.entries(character.traits).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleDelete(character.id)}
                  className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}

        {characters.length === 0 && !isCreating && (
          <div className="text-center text-sm text-neutral-500 mt-8">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No characters yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

