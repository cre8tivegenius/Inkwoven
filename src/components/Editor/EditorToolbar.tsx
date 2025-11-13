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

  return (
    <div className="flex items-center gap-1 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
          editor.isActive('bold') ? 'bg-neutral-300 dark:bg-neutral-600' : ''
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
          editor.isActive('italic') ? 'bg-neutral-300 dark:bg-neutral-600' : ''
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
          editor.isActive('heading', { level: 1 }) ? 'bg-neutral-300 dark:bg-neutral-600' : ''
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
          editor.isActive('heading', { level: 2 }) ? 'bg-neutral-300 dark:bg-neutral-600' : ''
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
          editor.isActive('heading', { level: 3 }) ? 'bg-neutral-300 dark:bg-neutral-600' : ''
        }`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
          editor.isActive('bulletList') ? 'bg-neutral-300 dark:bg-neutral-600' : ''
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
          editor.isActive('orderedList') ? 'bg-neutral-300 dark:bg-neutral-600' : ''
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

      {onFontChange && (
        <FontSelector value={fontFamily} onChange={onFontChange} />
      )}

      {onTextColorChange && (
        <ColorPicker label="Text Color" value={textColor} onChange={onTextColorChange} />
      )}

      {onBackgroundColorChange && (
        <ColorPicker label="Background Color" value={backgroundColor} onChange={onBackgroundColorChange} />
      )}

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />

      {document && <ExportMenu document={document} />}
    </div>
  )
}

