import { useState, useEffect } from 'react'
import { Bot, X, Send, Settings, Key } from 'lucide-react'
import { useAIStore } from '@/stores/aiStore'
import { OpenAIConnector, AnthropicConnector, GeminiConnector } from '@/lib/ai/connectors'
import type { AIConnector } from '@/lib/ai/connectors'

interface AISidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedText?: string
}

export function AISidebar({ isOpen, onClose, selectedText }: AISidebarProps) {
  const { selectedConnector, connectors, setConnector, setSelectedConnector, getConnectorConfig } =
    useAIStore()
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [connectorInstance, setConnectorInstance] = useState<AIConnector | null>(null)

  useEffect(() => {
    if (selectedConnector) {
      const config = getConnectorConfig(selectedConnector)
      if (config) {
        if (selectedConnector === 'openai') {
          setConnectorInstance(new OpenAIConnector(config))
        } else if (selectedConnector === 'anthropic') {
          setConnectorInstance(new AnthropicConnector(config))
        } else if (selectedConnector === 'gemini') {
          setConnectorInstance(new GeminiConnector(config))
        }
      }
    }
  }, [selectedConnector, getConnectorConfig])

  const handleSend = async () => {
    if (!connectorInstance || !message.trim()) return

    setIsLoading(true)
    setResponse('')

    try {
      const fullResponse = await connectorInstance.sendMessage(
        message,
        selectedText,
        (chunk) => {
          setResponse((prev) => prev + chunk)
        }
      )

      if (!response) {
        setResponse(fullResponse)
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-96 border-l border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            AI Assistant
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
          <h3 className="font-semibold mb-3 text-neutral-900 dark:text-neutral-50">
            AI Provider Settings
          </h3>
          <div className="space-y-3">
            {['openai', 'anthropic', 'gemini'].map((id) => {
              const config = connectors[id]
              return (
                <div key={id} className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {id === 'openai' ? 'OpenAI' : id === 'anthropic' ? 'Anthropic' : 'Google Gemini'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="API Key"
                      value={config?.apiKey || ''}
                      onChange={async (e) => {
                        await setConnector(id, {
                          ...config,
                          apiKey: e.target.value,
                        })
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50"
                    />
                    <button
                      onClick={() => setSelectedConnector(id)}
                      className={`px-3 py-2 text-sm rounded ${
                        selectedConnector === id
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50'
                      }`}
                    >
                      Use
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedText && (
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border-b border-neutral-200 dark:border-neutral-700">
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Selected Text:
          </p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
            "{selectedText.slice(0, 100)}..."
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {response && (
          <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <p className="text-sm whitespace-pre-wrap text-neutral-900 dark:text-neutral-50">
              {response}
            </p>
          </div>
        )}
        {!connectorInstance && (
          <div className="text-center text-sm text-neutral-500 mt-8">
            <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Configure an AI provider in settings to get started</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask AI for help..."
            disabled={!connectorInstance || isLoading}
            className="flex-1 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!connectorInstance || isLoading || !message.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

