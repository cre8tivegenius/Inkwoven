import type { AIConnector, AIConfig } from './base'

export class OpenAIConnector implements AIConnector {
  name = 'OpenAI'
  id = 'openai'
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config
  }

  async sendMessage(
    message: string,
    context?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4',
        messages: [
          ...(context
            ? [
                {
                  role: 'system',
                  content: `Context from document: ${context}`,
                },
              ]
            : []),
          {
            role: 'user',
            content: message,
          },
        ],
        stream: !!onChunk,
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    if (onChunk) {
      // Handle streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter((line) => line.trim() !== '')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const json = JSON.parse(data)
                const content = json.choices?.[0]?.delta?.content
                if (content) {
                  fullResponse += content
                  onChunk(content)
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      return fullResponse
    } else {
      const data = await response.json()
      return data.choices[0].message.content
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

