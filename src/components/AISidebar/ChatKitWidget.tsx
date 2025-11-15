import { useState } from 'react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useAIStore } from '@/stores/aiStore'
import { decryptValue, isEncrypted } from '@/lib/security/encryption'

interface ChatKitWidgetProps {
  workflowId?: string
  className?: string
}

export function ChatKitWidget({ workflowId, className }: ChatKitWidgetProps) {
  const { getConnectorConfig } = useAIStore()
  const [deviceId] = useState(() => {
    // Generate or retrieve a persistent device ID
    let id = localStorage.getItem('inkwoven-device-id')
    if (!id) {
      id = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('inkwoven-device-id', id)
    }
    return id
  })

  const getClientSecret = async (currentClientSecret: string | null): Promise<string> => {
    if (currentClientSecret) {
      // Implement session refresh if needed
      // For now, create a new session
    }

    const openaiConfig = getConnectorConfig('openai')
    if (!openaiConfig?.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    let apiKey = openaiConfig.apiKey
    if (isEncrypted(apiKey)) {
      apiKey = await decryptValue(apiKey)
    }

    const defaultWorkflowId = workflowId || import.meta.env.VITE_CHATKIT_WORKFLOW_ID || ''

    if (!defaultWorkflowId) {
      throw new Error('ChatKit workflow ID not configured. Please set VITE_CHATKIT_WORKFLOW_ID in your .env file or provide a workflowId prop.')
    }

    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workflow: { id: defaultWorkflowId },
        user: deviceId,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create ChatKit session: ${error}`)
    }

    const { client_secret } = await response.json()
    return client_secret
  }

  const { control } = useChatKit({
    api: {
      getClientSecret,
    },
  })

  return <ChatKit control={control} className={className || 'h-full w-full'} />
}

