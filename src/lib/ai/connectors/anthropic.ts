import type { AIConnector, AIConfig } from './base'

export class AnthropicConnector implements AIConnector {
  name = 'Anthropic'
  id = 'anthropic'
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config
  }

  async sendMessage(
    message: string,
    context?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: this.config.maxTokens || 1000,
        messages: [
          {
            role: 'user',
            content: context
              ? `Context: ${context}\n\nUser: ${message}`
              : message,
          },
        ],
        stream: !!onChunk,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    if (onChunk) {
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
                if (json.type === 'content_block_delta') {
                  const text = json.delta?.text
                  if (text) {
                    fullResponse += text
                    onChunk(text)
                  }
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
      return data.content[0].text
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }],
        }),
      })
      return response.ok || response.status === 400 // 400 means auth worked but request was invalid
    } catch {
      return false
    }
  }
}

