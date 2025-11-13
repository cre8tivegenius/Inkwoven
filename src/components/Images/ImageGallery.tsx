import { useEffect, useState } from 'react'
import { Image as ImageIcon, X, Upload } from 'lucide-react'
import { imageService } from '@/db/database'
import type { ImageAttachment } from '@/types'
import { useEditorStore } from '@/stores/editorStore'

interface ImageGalleryProps {
  projectId: string | null
  documentId: string | null
  isOpen: boolean
  onClose: () => void
}

export function ImageGallery({ projectId, documentId, isOpen, onClose }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageAttachment[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { editor } = useEditorStore()

  useEffect(() => {
    if (isOpen) {
      loadImages()
    }
  }, [isOpen, projectId, documentId])

  const loadImages = async () => {
    const imgs = await imageService.getAll(projectId, documentId)
    setImages(imgs)
  }

  const handleFileUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const blob = new Blob([file], { type: file.type })
        await imageService.create({
          projectId,
          documentId,
          name: file.name,
          data: blob,
          mimeType: file.type,
        })
      }
    }
    await loadImages()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      await handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFileUpload(e.target.files)
    }
  }

  const handleInsertImage = async (image: ImageAttachment) => {
    if (!editor) return

    // Convert blob to data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      editor.chain().focus().setImage({ src: dataUrl }).run()
    }
    reader.readAsDataURL(image.data)
    onClose()
  }

  const handleDeleteImage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this image?')) {
      await imageService.delete(id)
      await loadImages()
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-80 border-l border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Images
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-4 ${
          isDragging ? 'bg-primary-50 dark:bg-primary-900/20' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className="block mb-4">
          <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-primary-500 cursor-pointer">
            <Upload className="w-5 h-5" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Upload Images
            </span>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          {images.map((image) => {
            const imageUrl = URL.createObjectURL(image.data)
            return (
              <div
                key={image.id}
                className="relative group cursor-pointer"
                onClick={() => handleInsertImage(image)}
              >
                <img
                  src={imageUrl}
                  alt={image.name}
                  className="w-full h-24 object-cover rounded border border-neutral-200 dark:border-neutral-700"
                />
                <button
                  onClick={(e) => handleDeleteImage(image.id, e)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>

        {images.length === 0 && (
          <div className="text-center text-sm text-neutral-500 mt-8">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No images yet. Drag and drop or upload images here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

