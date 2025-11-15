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
    let isMounted = true
    const fetchDocuments = async () => {
      const docs = await documentService.getAll(projectId)
      if (isMounted) {
        setDocuments(docs)
      }
    }
    fetchDocuments()
    return () => {
      isMounted = false
    }
  }, [projectId])

  const filteredDocuments = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-64 glass-panel flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-white/30 dark:border-neutral-800/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold font-display text-neutral-900 dark:text-neutral-50">Documents</h2>
          <button
            onClick={onNewDocument}
            className="p-1.5 rounded-xl border border-transparent hover:border-primary-200 hover:bg-white/70 dark:hover:bg-neutral-800/70"
            title="New Document"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-white/40 dark:border-neutral-700/70 rounded-2xl bg-white/70 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-300"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredDocuments.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelectDocument(doc.id)}
            className={`w-full text-left px-4 py-2.5 flex items-center gap-2 mx-2 mt-2 rounded-2xl transition-colors ${
              selectedDocumentId === doc.id
                ? 'bg-primary-100/70 text-neutral-900'
                : 'hover:bg-white/60 dark:hover:bg-neutral-800/60'
            }`}
          >
            <FileText className="w-4 h-4 flex-shrink-0 text-primary-600" />
            <span className="text-sm truncate font-medium">{doc.title || 'Untitled'}</span>
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

