import { useEditor, EditorContent } from '@tiptap/react'
import type { JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'
import { useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { EditorToolbar } from './EditorToolbar'
import './Editor.css'

import type { Document } from '@/types'

interface EditorProps {
  document?: Document
  content?: JSONContent
  onUpdate?: (content: JSONContent) => void
  fontFamily?: string
  textColor?: string
  backgroundColor?: string
  onFontChange?: (font: string) => void
  onTextColorChange?: (color: string) => void
  onBackgroundColorChange?: (color: string) => void
}

export function Editor({ 
  document,
  content, 
  onUpdate, 
  fontFamily, 
  textColor, 
  backgroundColor,
  onFontChange,
  onTextColorChange,
  onBackgroundColorChange,
}: EditorProps) {
  const { setEditor } = useEditorStore()

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: content || '<p>Start writing...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none',
        style: `
          font-family: ${fontFamily || 'Inter, sans-serif'};
          color: ${textColor || 'inherit'};
          background-color: ${backgroundColor || 'transparent'};
          min-height: 100%;
          padding: 2rem;
        `,
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON())
      }
    },
  })

  useEffect(() => {
    if (editor) {
      setEditor(editor)
    }
    return () => {
      setEditor(null)
    }
  }, [editor, setEditor])

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useEffect(() => {
    if (editor && fontFamily) {
      editor.chain().focus().setFontFamily(fontFamily).run()
    }
  }, [editor, fontFamily])

  useEffect(() => {
    if (editor && textColor) {
      editor.chain().focus().setColor(textColor).run()
    }
  }, [editor, textColor])

  if (!editor) {
    return <div className="flex items-center justify-center h-full">Loading editor...</div>
  }

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar 
        editor={editor}
        document={document}
        fontFamily={fontFamily}
        textColor={textColor}
        backgroundColor={backgroundColor}
        onFontChange={onFontChange}
        onTextColorChange={onTextColorChange}
        onBackgroundColorChange={onBackgroundColorChange}
      />
      <div className="flex-1 overflow-auto px-6 py-6 bg-gradient-to-b from-transparent via-white/30 to-transparent dark:via-neutral-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[2.5rem] border border-white/60 dark:border-neutral-800/70 bg-white/95 dark:bg-neutral-900/70 shadow-[0_20px_60px_rgba(36,26,21,0.12)] backdrop-blur-lg overflow-hidden">
            <EditorContent editor={editor} className="min-h-[70vh]" />
          </div>
        </div>
      </div>
    </div>
  )
}

