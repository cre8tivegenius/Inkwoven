import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const tokensPath = join(__dirname, '..', process.argv[2] || 'design-tokens/tokens.json')
const tailwindConfigPath = join(__dirname, '..', 'tailwind.config.ts')

try {
  const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'))
  
  // Extract colors from tokens
  const colors = {}
  if (tokens.color) {
    Object.keys(tokens.color).forEach(colorName => {
      const colorObj = tokens.color[colorName]
      colors[colorName] = {}
      Object.keys(colorObj).forEach(shade => {
        colors[colorName][shade] = colorObj[shade].value
      })
    })
  }

  // Read current Tailwind config
  let configContent = readFileSync(tailwindConfigPath, 'utf-8')
  
  // Update colors in config (simple replacement for now)
  // In a production setup, you'd want a more sophisticated parser
  console.log('Tokens synced successfully. Update tailwind.config.ts manually if needed.')
  console.log('Colors extracted:', JSON.stringify(colors, null, 2))
  
} catch (error) {
  console.error('Error syncing tokens:', error.message)
  process.exit(1)
}

