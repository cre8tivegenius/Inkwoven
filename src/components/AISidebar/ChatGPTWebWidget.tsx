import { useState, useEffect, useRef } from 'react'
import { LogIn, ExternalLink, MessageSquare, Loader2 } from 'lucide-react'

interface ChatGPTWebWidgetProps {
  className?: string
}

export function ChatGPTWebWidget({ className }: ChatGPTWebWidgetProps) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [chatWindow, setChatWindow] = useState<Window | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const chatUrlRef = useRef<string>('https://chat.openai.com')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Check if user has previously signed in (stored preference)
    const hasSignedIn = localStorage.getItem('inkwoven-chatgpt-signed-in') === 'true'
    setIsSignedIn(hasSignedIn)
  }, [])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const handleSignIn = () => {
    setIsConnecting(true)
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Open ChatGPT in a new window
    const newWindow = window.open(
      chatUrlRef.current,
      'chatgpt',
      'width=1200,height=800,resizable=yes,scrollbars=yes'
    )
    
    if (newWindow) {
      setChatWindow(newWindow)
      setIsSignedIn(true)
      localStorage.setItem('inkwoven-chatgpt-signed-in', 'true')
      
      // Monitor if window is closed
      intervalRef.current = setInterval(() => {
        if (newWindow.closed) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setChatWindow(null)
        }
      }, 1000)
    }
    
    setIsConnecting(false)
  }

  const handleOpenChatGPT = () => {
    if (chatWindow && !chatWindow.closed) {
      chatWindow.focus()
    } else {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      const newWindow = window.open(
        chatUrlRef.current,
        'chatgpt',
        'width=1200,height=800,resizable=yes,scrollbars=yes'
      )
      if (newWindow) {
        setChatWindow(newWindow)
        
        // Monitor if window is closed
        intervalRef.current = setInterval(() => {
          if (newWindow.closed) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setChatWindow(null)
          }
        }, 1000)
      }
    }
  }

  if (!isSignedIn) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className || ''}`}>
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-4">
              <MessageSquare className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
            Connect to ChatGPT
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Use ChatGPT's free web version without API keys. Sign in with your OpenAI account to get started.
          </p>
          <button
            onClick={handleSignIn}
            disabled={isConnecting}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Opening ChatGPT...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign in to ChatGPT
              </>
            )}
          </button>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4">
            A new window will open where you can sign in to ChatGPT. After signing in, you can chat directly in that window.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${className || ''}`}>
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              ChatGPT Web
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Connected to ChatGPT free version
            </p>
          </div>
          <button
            onClick={handleOpenChatGPT}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open ChatGPT
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-primary-600 dark:text-primary-400 opacity-50" />
          <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
            ChatGPT is Ready
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Click "Open ChatGPT" above to start chatting. The chat will open in a new window where you can interact with ChatGPT directly.
          </p>
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 text-left">
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              💡 Tips:
            </p>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 list-disc list-inside">
              <li>ChatGPT will open in a popup window</li>
              <li>Sign in with your OpenAI account if prompted</li>
              <li>You can resize and move the chat window</li>
              <li>Your conversation history is saved in ChatGPT</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

