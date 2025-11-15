import { useEffect, useRef } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { documentService } from '@/db/database'

const AUTOSAVE_INTERVAL = 10000 // 10 seconds

export function useAutosave() {
  const { editor, currentDocument, setSaving, setLastSaved } = useEditorStore()
  const autosaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!editor || !currentDocument) {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current)
        autosaveTimerRef.current = null
      }
      return
    }

    const saveDocument = async () => {
      if (!currentDocument || !editor) return

      setSaving(true)
      try {
        const content = editor.getJSON()
        const title = extractTitle(content) || 'Untitled'

        await documentService.update(currentDocument.id, {
          content,
          title,
        })

        setLastSaved(new Date())
      } catch (error) {
        console.error('Autosave failed:', error)
      } finally {
        setSaving(false)
      }
    }

    // Autosave on interval
    autosaveTimerRef.current = setInterval(saveDocument, AUTOSAVE_INTERVAL)

    // Autosave on blur
    const handleBlur = () => {
      saveDocument()
    }

    const editorElement = editor.view.dom
    editorElement.addEventListener('blur', handleBlur)

    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current)
      }
      editorElement.removeEventListener('blur', handleBlur)
    }
  }, [editor, currentDocument, setSaving, setLastSaved])

  const extractTitle = (content: any): string | null => {
    if (!content?.content) return null
    const firstParagraph = content.content.find((node: any) => node.type === 'paragraph')
    if (firstParagraph?.content?.[0]?.text) {
      return firstParagraph.content[0].text.slice(0, 50)
    }
    return null
  }
}

