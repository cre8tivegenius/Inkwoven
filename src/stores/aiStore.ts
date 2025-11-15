import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIConfig } from '@/lib/ai/connectors'
import { encryptValue, decryptValue, isEncrypted } from '@/lib/security/encryption'

interface StoredAIConfig extends AIConfig {
  _encrypted?: boolean
}

interface AIState {
  selectedConnector: string | null
  connectors: Record<string, AIConfig>
  setConnector: (id: string, config: AIConfig) => Promise<void>
  setSelectedConnector: (id: string | null) => void
  getConnectorConfig: (id: string) => AIConfig | undefined
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      selectedConnector: null,
      connectors: {},
      setConnector: async (id, config) => {
        // Encrypt API key before storing
        let encryptedConfig: StoredAIConfig = { ...config, _encrypted: false }
        if (config.apiKey && !isEncrypted(config.apiKey)) {
          try {
            encryptedConfig.apiKey = await encryptValue(config.apiKey)
            encryptedConfig._encrypted = true
          } catch (error) {
            console.error('Failed to encrypt API key:', error)
            // Continue with unencrypted key if encryption fails
          }
        } else if (config.apiKey && isEncrypted(config.apiKey)) {
          encryptedConfig._encrypted = true
        }

        set((state) => ({
          connectors: { ...state.connectors, [id]: encryptedConfig as AIConfig },
        }))
      },
      setSelectedConnector: (id) => set({ selectedConnector: id }),
      getConnectorConfig: (id) => {
        const config = get().connectors[id]
        if (!config) return undefined

        // Return config as-is - decryption happens when connector is created
        return config
      },
    }),
    {
      name: 'inkwoven-ai',
      // Transform on rehydrate to decrypt API keys
      onRehydrateStorage: () => async (state) => {
        if (state?.connectors) {
          const decryptedConnectors: Record<string, AIConfig> = {}
          for (const [id, config] of Object.entries(state.connectors)) {
            const cfg = config as StoredAIConfig
            if (cfg?.apiKey && isEncrypted(cfg.apiKey)) {
              try {
                decryptedConnectors[id] = {
                  ...cfg,
                  apiKey: await decryptValue(cfg.apiKey),
                  _encrypted: undefined, // Remove internal flag
                } as AIConfig
              } catch (error) {
                console.error(`Failed to decrypt API key for ${id}:`, error)
                decryptedConnectors[id] = cfg as AIConfig
              }
            } else {
              decryptedConnectors[id] = cfg as AIConfig
            }
          }
          state.connectors = decryptedConnectors
        }
      },
    }
  )
)
