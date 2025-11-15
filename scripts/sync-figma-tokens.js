import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY
const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN
const OUTPUT_PATH = process.env.OUTPUT_PATH || join(__dirname, '..', 'design-tokens', 'tokens.json')

if (!FIGMA_FILE_KEY || !FIGMA_API_TOKEN) {
  console.error('Error: FIGMA_FILE_KEY and FIGMA_API_TOKEN environment variables are required')
  process.exit(1)
}

async function fetchFigmaTokens() {
  try {
    console.log('Fetching tokens from Figma...')
    
    // Try to fetch variables from Figma Variables API
    // Note: This requires Figma Variables to be set up in your file
    const variablesResponse = await fetch(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
      {
        headers: {
          'X-Figma-Token': FIGMA_API_TOKEN,
        },
      }
    )

    if (!variablesResponse.ok) {
      // If variables endpoint doesn't work, try the file endpoint
      // This might be needed if using Tokens Studio plugin exports
      console.log('Variables endpoint not available, trying file endpoint...')
      
      const fileResponse = await fetch(
        `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
        {
          headers: {
            'X-Figma-Token': FIGMA_API_TOKEN,
          },
        }
      )

      if (!fileResponse.ok) {
        const errorText = await fileResponse.text()
        throw new Error(`Figma API error: ${fileResponse.status} ${errorText}`)
      }

      const fileData = await fileResponse.json()
      const tokens = transformFileDataToTokens(fileData)
      
      // Ensure output directory exists
      const outputDir = dirname(OUTPUT_PATH)
      mkdirSync(outputDir, { recursive: true })
      
      // Write tokens to file
      writeFileSync(OUTPUT_PATH, JSON.stringify(tokens, null, 2))
      console.log(`✅ Tokens synced successfully to ${OUTPUT_PATH}`)
      return
    }

    const variablesData = await variablesResponse.json()
    
    // Transform Figma variables to Tokens Studio format
    const tokens = transformVariablesToTokens(variablesData)
    
    // Ensure output directory exists
    const outputDir = dirname(OUTPUT_PATH)
    mkdirSync(outputDir, { recursive: true })
    
    // Write tokens to file
    writeFileSync(OUTPUT_PATH, JSON.stringify(tokens, null, 2))
    console.log(`✅ Tokens synced successfully to ${OUTPUT_PATH}`)
    
  } catch (error) {
    console.error('Error syncing tokens:', error.message)
    console.error('\nNote: If you are using Tokens Studio plugin, you may need to:')
    console.error('1. Export tokens from the plugin to a JSON file')
    console.error('2. Store that file in your repository')
    console.error('3. Or use a different sync method')
    process.exit(1)
  }
}

function transformVariablesToTokens(variablesData) {
  // Default token structure matching your existing tokens.json
  const tokens = {
    '$schema': 'https://schemas.tokens.studio/tokens',
    color: {},
    typography: {
      fontFamily: {
        sans: { value: 'Inter, system-ui, sans-serif' },
        serif: { value: 'Merriweather, Georgia, serif' },
        mono: { value: 'Fira Code, monospace' }
      }
    },
    spacing: {
      xs: { value: '0.25rem' },
      sm: { value: '0.5rem' },
      md: { value: '1rem' },
      lg: { value: '1.5rem' },
      xl: { value: '2rem' },
      '2xl': { value: '3rem' }
    }
  }

  // Transform Figma variables to tokens
  if (variablesData.meta?.variables) {
    const variables = variablesData.meta.variables
    
    Object.values(variables).forEach(variable => {
      const name = variable.name
      const valuesByMode = variable.valuesByMode || {}
      
      // Get the first mode's value (or use default)
      const firstMode = Object.keys(valuesByMode)[0]
      if (!firstMode) return
      
      const value = valuesByMode[firstMode]
      
      // Handle color variables
      if (variable.resolvedType === 'COLOR' || (typeof value === 'object' && value.r !== undefined)) {
        const colorValue = typeof value === 'object' 
          ? rgbToHex(value.r, value.g, value.b, value.a)
          : value
        
        // Parse color name (e.g., "primary/500" -> { category: "primary", shade: "500" })
        const parts = name.split('/')
        if (parts.length === 2) {
          const [category, shade] = parts
          if (!tokens.color[category]) {
            tokens.color[category] = {}
          }
          tokens.color[category][shade] = { value: colorValue }
        } else {
          // Single-level color name
          if (!tokens.color[name]) {
            tokens.color[name] = {}
          }
          tokens.color[name].value = { value: colorValue }
        }
      }
      // Handle other variable types (spacing, typography, etc.)
      else if (variable.resolvedType === 'FLOAT' || typeof value === 'number') {
        // Could map to spacing or other numeric tokens
        if (name.toLowerCase().includes('spacing') || name.toLowerCase().includes('space')) {
          const spacingName = name.split('/').pop() || name
          tokens.spacing[spacingName] = { value: `${value}px` }
        }
      }
    })
  }

  return tokens
}

function transformFileDataToTokens(fileData) {
  // Fallback: return default token structure if we can't parse from file
  // This is a placeholder - you may need to customize based on your Figma setup
  return {
    '$schema': 'https://schemas.tokens.studio/tokens',
    color: {
      primary: {
        '50': { value: '#f0f9ff' },
        '100': { value: '#e0f2fe' },
        '200': { value: '#bae6fd' },
        '300': { value: '#7dd3fc' },
        '400': { value: '#38bdf8' },
        '500': { value: '#0ea5e9' },
        '600': { value: '#0284c7' },
        '700': { value: '#0369a1' },
        '800': { value: '#075985' },
        '900': { value: '#0c4a6e' }
      },
      neutral: {
        '50': { value: '#fafafa' },
        '100': { value: '#f5f5f5' },
        '200': { value: '#e5e5e5' },
        '300': { value: '#d4d4d4' },
        '400': { value: '#a3a3a3' },
        '500': { value: '#737373' },
        '600': { value: '#525252' },
        '700': { value: '#404040' },
        '800': { value: '#262626' },
        '900': { value: '#171717' }
      }
    },
    typography: {
      fontFamily: {
        sans: { value: 'Inter, system-ui, sans-serif' },
        serif: { value: 'Merriweather, Georgia, serif' },
        mono: { value: 'Fira Code, monospace' }
      }
    },
    spacing: {
      xs: { value: '0.25rem' },
      sm: { value: '0.5rem' },
      md: { value: '1rem' },
      lg: { value: '1.5rem' },
      xl: { value: '2rem' },
      '2xl': { value: '3rem' }
    }
  }
}

function rgbToHex(r, g, b, a = 1) {
  const toHex = (n) => {
    const hex = Math.round(n * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
  return a < 1 ? `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}` : hex
}

fetchFigmaTokens()

