import { Editor } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Undo,
  Redo,
} from 'lucide-react'
import { FontSelector } from './FontSelector'
import { ColorPicker } from './ColorPicker'
import { ExportMenu } from './ExportMenu'
import type { Document } from '@/types'

interface EditorToolbarProps {
  editor: Editor
  document?: Document
  fontFamily?: string
  textColor?: string
  backgroundColor?: string
  onFontChange?: (font: string) => void
  onTextColorChange?: (color: string) => void
  onBackgroundColorChange?: (color: string) => void
}

export function EditorToolbar({ 
  editor, 
  document,
  fontFamily, 
  textColor, 
  backgroundColor,
  onFontChange,
  onTextColorChange,
  onBackgroundColorChange,
}: EditorToolbarProps) {
  if (!editor) {
    return null
  }

  const baseButton =
    'p-2.5 rounded-2xl text-neutral-700 dark:text-neutral-100 border border-transparent hover:border-primary-200 hover:bg-primary-50/70 dark:hover:bg-neutral-800/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const activeButton = 'bg-primary-100/80 border-primary-200 text-primary-800'

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-white/30 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/60 backdrop-blur">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${baseButton} ${editor.isActive('bold') ? activeButton : ''}`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${baseButton} ${editor.isActive('italic') ? activeButton : ''}`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${baseButton} ${editor.isActive('heading', { level: 1 }) ? activeButton : ''}`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${baseButton} ${editor.isActive('heading', { level: 2 }) ? activeButton : ''}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${baseButton} ${editor.isActive('heading', { level: 3 }) ? activeButton : ''}`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${baseButton} ${editor.isActive('bulletList') ? activeButton : ''}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${baseButton} ${editor.isActive('orderedList') ? activeButton : ''}`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={baseButton}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={baseButton}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />

      {onFontChange && (
        <FontSelector value={fontFamily} onChange={onFontChange} />
      )}

      {onTextColorChange && (
        <ColorPicker label="Text Color" value={textColor} onChange={onTextColorChange} />
      )}

      {onBackgroundColorChange && (
        <ColorPicker label="Background Color" value={backgroundColor} onChange={onBackgroundColorChange} />
      )}

      <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1" />

      {document && <ExportMenu document={document} />}
    </div>
  )
}

