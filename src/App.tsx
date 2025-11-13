import { useEffect, useState } from 'react'
import { Header } from '@/components/Layout/Header'
import { Main } from '@/components/Layout/Main'
import { Editor } from '@/components/Editor/Editor'
import { ProjectSidebar } from '@/components/Projects/ProjectSidebar'
import { DocumentList } from '@/components/Documents/DocumentList'
import { TemplateSelector } from '@/components/Templates/TemplateSelector'
import { AISidebar } from '@/components/AISidebar/AISidebar'
import { ExerciseModal } from '@/components/Exercises/ExerciseModal'
import { ExerciseNotification } from '@/components/Exercises/ExerciseNotification'
import { ImageGallery } from '@/components/Images/ImageGallery'
import { CharacterManager } from '@/components/Characters/CharacterManager'
import { WorldManager } from '@/components/Worlds/WorldManager'
import { useExerciseNotification } from '@/hooks/useExerciseNotification'
import { type Template } from '@/lib/templates'
import { useEditorStore } from '@/stores/editorStore'
import { useThemeStore } from '@/stores/themeStore'
import { documentService } from '@/db/database'
import { useAutosave } from '@/hooks/useAutosave'

function App() {
  const { theme } = useThemeStore()
  const { editor, currentDocument, setCurrentDocument } = useEditorStore()
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [aiSidebarOpen, setAISidebarOpen] = useState(false)
  const [selectedText, setSelectedText] = useState<string>('')
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [imagesOpen, setImagesOpen] = useState(false)
  const [charactersOpen, setCharactersOpen] = useState(false)
  const [worldsOpen, setWorldsOpen] = useState(false)
  const { showNotification, dismissNotification } = useExerciseNotification()
  
  // Enable autosave
  useAutosave()

  useEffect(() => {
    // Initialize theme
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    // Load or create initial document
    const initializeDocument = async () => {
      const documents = await documentService.getAll(selectedProjectId)
      if (documents.length > 0) {
        const doc = documents[0]
        setDocumentId(doc.id)
        setCurrentDocument(doc)
      } else {
        // Create a new document
        const id = await documentService.create({
          projectId: selectedProjectId,
          title: 'Untitled',
          content: { type: 'doc', content: [{ type: 'paragraph' }] },
          format: 'inkwoven',
        })
        setDocumentId(id)
        const doc = await documentService.getById(id)
        if (doc) {
          setCurrentDocument(doc)
        }
      }
    }
    initializeDocument()
  }, [selectedProjectId, setCurrentDocument])

  const handleSelectDocument = async (id: string) => {
    const doc = await documentService.getById(id)
    if (doc) {
      setDocumentId(id)
      setCurrentDocument(doc)
    }
  }

  const handleNewDocument = async () => {
    setShowTemplateSelector(true)
  }

  const handleSelectTemplate = async (template: Template) => {
    const id = await documentService.create({
      projectId: selectedProjectId,
      title: template.name,
      content: template.content,
      format: 'inkwoven',
    })
    const doc = await documentService.getById(id)
    if (doc) {
      setDocumentId(id)
      setCurrentDocument(doc)
    }
  }

  const handleEditorUpdate = async (content: { content?: Array<{ type: string; content?: Array<{ text?: string }> }> }) => {
    if (!documentId || !editor) return

    await documentService.update(documentId, {
      content,
      title: extractTitle(content) || 'Untitled',
    })
  }

  const handleFontChange = async (font: string) => {
    if (!documentId) return
    await documentService.update(documentId, { fontFamily: font })
    const updated = await documentService.getById(documentId)
    if (updated) setCurrentDocument(updated)
  }

  const handleTextColorChange = async (color: string) => {
    if (!documentId) return
    await documentService.update(documentId, { textColor: color })
    const updated = await documentService.getById(documentId)
    if (updated) setCurrentDocument(updated)
  }

  const handleBackgroundColorChange = async (color: string) => {
    if (!documentId) return
    await documentService.update(documentId, { backgroundColor: color })
    const updated = await documentService.getById(documentId)
    if (updated) setCurrentDocument(updated)
  }

  const extractTitle = (content: { content?: Array<{ type: string; content?: Array<{ text?: string }> }> }): string | null => {
    if (!content?.content) return null
    const firstParagraph = content.content.find((node) => node.type === 'paragraph')
    if (firstParagraph?.content?.[0]?.text) {
      return firstParagraph.content[0].text.slice(0, 50)
    }
    return null
  }

  useEffect(() => {
    // Capture selected text for AI context
    const handleSelection = (): void => {
      const selection = window.getSelection()
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString())
      } else {
        setSelectedText('')
      }
    }

    document.addEventListener('selectionchange', handleSelection)
    return () => document.removeEventListener('selectionchange', handleSelection)
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <Header
        onToggleAI={() => setAISidebarOpen(!aiSidebarOpen)}
        aiOpen={aiSidebarOpen}
        onToggleImages={() => setImagesOpen(!imagesOpen)}
        imagesOpen={imagesOpen}
        onToggleCharacters={() => setCharactersOpen(!charactersOpen)}
        charactersOpen={charactersOpen}
        onToggleWorlds={() => setWorldsOpen(!worldsOpen)}
        worldsOpen={worldsOpen}
        hasProject={selectedProjectId !== null}
      />
      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
        <DocumentList
          projectId={selectedProjectId}
          selectedDocumentId={documentId}
          onSelectDocument={handleSelectDocument}
          onNewDocument={handleNewDocument}
        />
        <Main>
          {currentDocument && (
            <Editor
              document={currentDocument}
              content={currentDocument.content}
              onUpdate={handleEditorUpdate}
              fontFamily={currentDocument.fontFamily}
              textColor={currentDocument.textColor}
              backgroundColor={currentDocument.backgroundColor}
              onFontChange={handleFontChange}
              onTextColorChange={handleTextColorChange}
              onBackgroundColorChange={handleBackgroundColorChange}
            />
          )}
        </Main>
      </div>
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
      <AISidebar
        isOpen={aiSidebarOpen}
        onClose={() => setAISidebarOpen(false)}
        selectedText={selectedText}
      />
      <ImageGallery
        projectId={selectedProjectId}
        documentId={documentId}
        isOpen={imagesOpen}
        onClose={() => setImagesOpen(false)}
      />
      <CharacterManager
        projectId={selectedProjectId}
        isOpen={charactersOpen}
        onClose={() => setCharactersOpen(false)}
      />
      <WorldManager
        projectId={selectedProjectId}
        isOpen={worldsOpen}
        onClose={() => setWorldsOpen(false)}
      />
      {showNotification && (
        <ExerciseNotification
          onStart={() => {
            setShowExerciseModal(true)
            dismissNotification()
          }}
          onDismiss={dismissNotification}
        />
      )}
      <ExerciseModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onComplete={() => {
          // Exercise completed
        }}
      />
    </div>
  )
}

export default App
