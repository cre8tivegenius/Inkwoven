import { useEffect, useState } from 'react'
import { FileText, Plus, Search } from 'lucide-react'
import { documentService } from '@/db/database'
import type { Document } from '@/types'

interface DocumentListProps {
  projectId: string | null
  selectedDocumentId: string | null
  onSelectDocument: (documentId: string) => void
  onNewDocument: () => void
}

export function DocumentList({
  projectId,
  selectedDocumentId,
  onSelectDocument,
  onNewDocument,
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadDocuments()
  }, [projectId])

  const loadDocuments = async () => {
    const docs = await documentService.getAll(projectId)
    setDocuments(docs)
  }

  const filteredDocuments = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-64 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Documents</h2>
          <button
            onClick={onNewDocument}
            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            title="New Document"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-8 pr-2 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredDocuments.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelectDocument(doc.id)}
            className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
              selectedDocumentId === doc.id ? 'bg-neutral-100 dark:bg-neutral-700' : ''
            }`}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{doc.title || 'Untitled'}</span>
          </button>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-neutral-500">
            {searchQuery ? 'No documents found' : 'No documents yet'}
          </div>
        )}
      </div>
    </div>
  )
}

