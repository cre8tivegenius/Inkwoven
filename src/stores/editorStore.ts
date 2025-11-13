import { create } from 'zustand'
import type { Editor } from '@tiptap/react'
import type { Document } from '@/types'

interface EditorState {
  editor: Editor | null
  currentDocument: Document | null
  isSaving: boolean
  lastSaved: Date | null
  setEditor: (editor: Editor | null) => void
  setCurrentDocument: (document: Document | null) => void
  setSaving: (isSaving: boolean) => void
  setLastSaved: (date: Date | null) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  editor: null,
  currentDocument: null,
  isSaving: false,
  lastSaved: null,
  setEditor: (editor) => set({ editor }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  setSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (date) => set({ lastSaved: date }),
}))

