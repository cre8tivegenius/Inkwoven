import { useState, useEffect } from 'react'
import { Bot, X, Send, Settings, Key } from 'lucide-react'
import { useAIStore } from '@/stores/aiStore'
import { OpenAIConnector, AnthropicConnector, GeminiConnector } from '@/lib/ai/connectors'
import type { AIConnector } from '@/lib/ai/connectors'
import { ChatKitWidget } from './ChatKitWidget'
import { ChatGPTWebWidget } from './ChatGPTWebWidget'

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
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)
  const [useChatKit, setUseChatKit] = useState(() => {
    return localStorage.getItem('inkwoven-use-chatkit') === 'true'
  })
  const [useChatGPTWeb, setUseChatGPTWeb] = useState(() => {
    const stored = localStorage.getItem('inkwoven-use-chatgpt-web')
    if (stored === 'true') return true
    if (stored === 'false') return false
    // Default to ChatGPT Web if not explicitly set
    return true
  })

  // Auto-show settings on first open if no API keys are configured
  useEffect(() => {
    if (isOpen && !hasSeenWelcome) {
      const hasAnyApiKey = Object.values(connectors).some((config) => config?.apiKey)
      if (!hasAnyApiKey) {
        setShowSettings(true)
        setHasSeenWelcome(true)
      }
    }
  }, [isOpen, connectors, hasSeenWelcome])

  // Save ChatKit preference
  useEffect(() => {
    localStorage.setItem('inkwoven-use-chatkit', useChatKit.toString())
  }, [useChatKit])

  // Save ChatGPT Web preference
  useEffect(() => {
    localStorage.setItem('inkwoven-use-chatgpt-web', useChatGPTWeb.toString())
  }, [useChatGPTWeb])

  // Ensure only one mode is active at a time
  useEffect(() => {
    if (useChatGPTWeb && useChatKit) {
      setUseChatKit(false)
    }
  }, [useChatGPTWeb, useChatKit])

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
            title="Close AI Assistant"
            aria-label="Close AI Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
              AI Provider Settings
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              title="Hide settings"
              aria-label="Hide settings"
            >
              Hide
            </button>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
            Add an API key for any provider below. You only need one to get started. Keys are encrypted and stored locally.
          </p>
          
          {/* ChatGPT Web Mode Toggle */}
          <div className="mb-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label htmlFor="chatgpt-web-toggle" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Use ChatGPT Web (Free)
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Connect to ChatGPT's free web version - no API keys needed
                </p>
              </div>
              <label htmlFor="chatgpt-web-toggle" className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer">
                <input
                  id="chatgpt-web-toggle"
                  type="checkbox"
                  checked={useChatGPTWeb}
                  onChange={(e) => {
                    setUseChatGPTWeb(e.target.checked)
                    if (e.target.checked) {
                      setUseChatKit(false)
                    }
                  }}
                  className="sr-only"
                  aria-label={useChatGPTWeb ? 'Disable ChatGPT Web' : 'Enable ChatGPT Web'}
                />
                <span
                  className={`absolute inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useChatGPTWeb ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
                <span
                  className={`block h-6 w-11 rounded-full transition-colors ${
                    useChatGPTWeb ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              </label>
            </div>
            {useChatGPTWeb && (
              <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                <p>💡 ChatGPT Web opens in a popup window. Sign in with your OpenAI account to start chatting.</p>
              </div>
            )}
          </div>

          {/* ChatKit Mode Toggle */}
          <div className="mb-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label htmlFor="chatkit-toggle" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Use OpenAI ChatKit
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Use OpenAI's embeddable ChatKit widget (requires workflow ID)
                </p>
              </div>
              <label htmlFor="chatkit-toggle" className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer">
                <input
                  id="chatkit-toggle"
                  type="checkbox"
                  checked={useChatKit}
                  onChange={(e) => {
                    setUseChatKit(e.target.checked)
                    if (e.target.checked) {
                      setUseChatGPTWeb(false)
                    }
                  }}
                  className="sr-only"
                  aria-label={useChatKit ? 'Disable ChatKit' : 'Enable ChatKit'}
                />
                <span
                  className={`absolute inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useChatKit ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
                <span
                  className={`block h-6 w-11 rounded-full transition-colors ${
                    useChatKit ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              </label>
            </div>
            {useChatKit && (
              <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                <p>💡 ChatKit requires an OpenAI API key and a workflow ID from Agent Builder.</p>
                <p className="mt-1">Set <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">VITE_CHATKIT_WORKFLOW_ID</code> in your .env file.</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {['openai', 'anthropic', 'gemini'].map((id) => {
              const config = connectors[id]
              const providerName = id === 'openai' ? 'OpenAI' : id === 'anthropic' ? 'Anthropic' : 'Google Gemini'
              const providerLink = 
                id === 'openai' ? 'https://platform.openai.com/api-keys' :
                id === 'anthropic' ? 'https://console.anthropic.com/' :
                'https://makersuite.google.com/app/apikey'
              
              return (
                <div key={id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {providerName}
                    </label>
                    <a
                      href={providerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      Get key →
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder={`Enter ${providerName} API key`}
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
                      onClick={() => {
                        if (config?.apiKey) {
                          setSelectedConnector(id)
                          setShowSettings(false)
                        }
                      }}
                      disabled={!config?.apiKey}
                      className={`px-3 py-2 text-sm rounded font-medium ${
                        selectedConnector === id
                          ? 'bg-primary-600 text-white'
                          : config?.apiKey
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      {selectedConnector === id ? 'Active' : 'Use'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            💡 Tip: You can skip this step and use Inkwoven without AI features. Just close this sidebar to continue writing.
          </p>
        </div>
      )}

      {selectedText && !useChatKit && !useChatGPTWeb && (
        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border-b border-neutral-200 dark:border-neutral-700">
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Selected Text:
          </p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
            "{selectedText.slice(0, 100)}..."
          </p>
        </div>
      )}

      {useChatGPTWeb ? (
        <div className="flex-1 overflow-hidden">
          <ChatGPTWebWidget className="h-full w-full" />
        </div>
      ) : useChatKit ? (
        <div className="flex-1 overflow-hidden">
          {getConnectorConfig('openai')?.apiKey ? (
            <ChatKitWidget className="h-full w-full" />
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center p-6">
                <Key className="w-12 h-12 mx-auto mb-4 opacity-50 text-neutral-400" />
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
                  ChatKit Setup Required
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 max-w-sm mx-auto">
                  To use ChatKit, you need to configure an OpenAI API key and set up a workflow ID.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm font-medium"
                  title="Configure ChatKit"
                  aria-label="Configure ChatKit"
                >
                  Configure ChatKit
                </button>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4">
                  Learn more about ChatKit at{' '}
                  <a
                    href="https://platform.openai.com/docs/chatkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    platform.openai.com/docs/chatkit
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {response && (
              <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <p className="text-sm whitespace-pre-wrap text-neutral-900 dark:text-neutral-50">
                  {response}
                </p>
              </div>
            )}
            {!connectorInstance && (
              <div className="text-center p-6">
                <Key className="w-12 h-12 mx-auto mb-4 opacity-50 text-neutral-400" />
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
                  Welcome to AI Assistant
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 max-w-sm mx-auto">
                  Use ChatGPT Web for free (no API keys needed), or add an API key for OpenAI, Anthropic, or Gemini for more advanced features.
                </p>
                <div className="flex flex-col gap-2">
                  {useChatGPTWeb ? (
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                      ✓ ChatGPT Web is enabled - click "Sign in to ChatGPT" above
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm font-medium"
                      title="Configure AI"
                      aria-label="Configure AI"
                    >
                      Configure AI Assistant
                    </button>
                  )}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4">
                  {useChatGPTWeb 
                    ? 'ChatGPT Web opens in a popup window - no API keys required!'
                    : 'Your keys are encrypted and stored securely in your browser'
                  }
                </p>
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
                title="Send message"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

