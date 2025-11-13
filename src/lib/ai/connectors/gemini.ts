import type { AIConnector, AIConfig } from './base'

export class GeminiConnector implements AIConnector {
  name = 'Google Gemini'
  id = 'gemini'
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config
  }

  async sendMessage(
    message: string,
    context?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const model = this.config.model || 'gemini-pro'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: context
                  ? `Context: ${context}\n\nUser: ${message}`
                  : message,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: this.config.temperature || 0.7,
          maxOutputTokens: this.config.maxTokens || 1000,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Gemini doesn't support streaming in the same way, so we simulate it
    if (onChunk) {
      const words = text.split(' ')
      for (const word of words) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        onChunk(word + ' ')
      }
    }

    return text
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      )
      return response.ok
    } catch {
      return false
    }
  }
}

