import { useState } from 'react'
import { Search, ExternalLink, Loader2, AlertCircle } from 'lucide-react'
import { imageService } from '@/db/database'

interface PinterestImportProps {
  projectId: string | null
  documentId: string | null
  onImportComplete: () => void
  onClose?: () => void
}

export function PinterestImport({ projectId, documentId, onImportComplete }: PinterestImportProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [importingUrls, setImportingUrls] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const handleOpenPinterest = () => {
    const url = searchQuery
      ? `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}`
      : 'https://www.pinterest.com'
    
    window.open(url, 'pinterest', 'width=1200,height=800,resizable=yes,scrollbars=yes')
  }

  const handleImportFromUrl = async (url: string) => {
    if (importingUrls.has(url)) return
    
    setImportingUrls(prev => new Set(prev).add(url))
    setError(null)

    try {
      // Check if URL is already a direct image URL
      if (url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)) {
        // Direct image URL - fetch it
        const imageResponse = await fetch(url, {
          mode: 'cors',
          headers: {
            'Referer': 'https://www.pinterest.com/',
          },
        })

        if (!imageResponse.ok) {
          throw new Error('Failed to fetch image. Try right-clicking the image and copying the image address.')
        }

        const blob = await imageResponse.blob()
        const fileName = `pinterest-${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`

        await imageService.create({
          projectId,
          documentId,
          name: fileName,
          data: blob,
          mimeType: blob.type,
        })

        onImportComplete()
        return
      }

      // Pinterest pin URL - try to extract image
      // For pin URLs like: https://www.pinterest.com/pin/{pinId}/
      // We'll guide users to use the direct image URL instead
      throw new Error('Please use the direct image URL. Right-click the Pinterest image and select "Copy image address", then paste it here.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import image')
      console.error('Pinterest import error:', err)
    } finally {
      setImportingUrls(prev => {
        const next = new Set(prev)
        next.delete(url)
        return next
      })
    }
  }

  const handlePasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        await handleImportFromUrl(text.trim())
      } else {
        setError('Clipboard is empty. Please copy an image URL first.')
      }
    } catch (err) {
      setError('Failed to read clipboard. Please paste the URL manually.')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          Import from Pinterest
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
          Search Pinterest or paste a Pinterest pin URL to import images directly into your gallery.
        </p>
      </div>

      {/* Search Pinterest */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Search Pinterest
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleOpenPinterest()
              }
            }}
            placeholder="Enter search terms..."
            className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
          />
          <button
            onClick={handleOpenPinterest}
            disabled={false}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          Opens Pinterest in a new window. Copy pin URLs from there and paste below.
        </p>
      </div>

      {/* Import from URL */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Import Image URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste image URL here..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const url = (e.target as HTMLInputElement).value.trim()
                if (url) {
                  handleImportFromUrl(url)
                }
              }
            }}
            className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
          />
          <button
            onClick={handlePasteUrl}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center gap-2 text-sm font-medium"
          >
            Paste
          </button>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          Right-click a Pinterest image → "Copy image address" → Paste here. Or paste any direct image URL.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
              Tip: Right-click on a Pinterest image and select "Copy image address" for direct import.
            </p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {importingUrls.size > 0 && (
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Importing {importingUrls.size} image(s)...</span>
        </div>
      )}

      {/* Quick link */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <a
          href="https://www.pinterest.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <ExternalLink className="w-4 h-4" />
          Open Pinterest in new tab
        </a>
      </div>
    </div>
  )
}

