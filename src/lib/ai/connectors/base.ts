export interface AIConnector {
  name: string
  id: string
  sendMessage: (message: string, context?: string, onChunk?: (chunk: string) => void) => Promise<string>
  validateApiKey: (apiKey: string) => Promise<boolean>
}

export interface AIConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

