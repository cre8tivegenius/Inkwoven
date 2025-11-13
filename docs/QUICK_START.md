# Quick Start Guide

Get up and running with Inkwoven in minutes!

## 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

## 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 3. Add AI Provider API Keys (Optional)

To use the AI Writing Assistant:

1. Click the **AI Assistant** button in the app
2. Click the **Settings** icon (⚙️)
3. Enter your API keys for:
   - OpenAI: Get key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Anthropic: Get key from [console.anthropic.com](https://console.anthropic.com/)
   - Google Gemini: Get key from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
4. Click **"Use"** next to your preferred provider

**Your keys are automatically encrypted and stored securely!**

📖 **Detailed instructions**: See [API Keys Setup Guide](./API_KEYS_SETUP.md)

## 4. Start Writing!

- Create a new project
- Choose a template (Journal, Letter, Poetry, Story, or Blank)
- Start writing and use the AI Assistant for help

## Next Steps

- 📚 Read the [Security Guide](./SECURITY.md) for best practices
- 🔧 Configure [GitHub Secrets](./API_KEYS_SETUP.md#setting-up-github-secrets-for-cicd) for design token sync
- 🧪 Run tests: `npm test`
- 🏗️ Build for production: `npm run build`

## Need Help?

- Check the [Main README](../README.md)
- Review the [API Keys Setup Guide](./API_KEYS_SETUP.md)
- See [Security Documentation](./SECURITY.md)

