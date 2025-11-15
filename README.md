# Inkwoven

A personal writing and note-taking studio blending the elegance of Apple Pages, the creative freedom of Canva, and immersive storytelling tools.

## Features

### Core Writing Experience
- Rich-text editor (Tiptap) with full formatting and markdown support
- Google Fonts integration with full color picker
- Persistent dark/light mode toggle
- Local data storage (IndexedDB)
- Multi-format export: .txt, .md, .pdf, .odf

### AI Writing Assistant
- **ChatGPT Web integration** - Free, no API keys required (opens in popup)
- Sidebar with user-managed API credentials
- Support for OpenAI, Anthropic, and Google Gemini
- Optional OpenAI ChatKit integration for rich agent workflows
- Streaming responses
- Context-aware assistance with selected text

### Templates
- Journal, Letter, Poetry, Story, and Blank templates
- Template selector with previews

### Creative Tools
- Morning exercises with preset and AI-generated prompts
- Image attachments with drag-and-drop
- **Pinterest integration** - Search and import images directly from Pinterest
- Character management
- World building tools

### Project Management
- Multiple projects with organization
- Document management per project
- Search and filter capabilities

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript
- **Editor:** Tiptap + ProseMirror
- **Styling:** TailwindCSS 4
- **State Management:** Zustand
- **Database:** IndexedDB (Dexie.js)
- **Testing:** Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### iOS Support

Inkwoven is available as a Progressive Web App (PWA) for iOS devices. See [iOS Setup Guide](./docs/IOS_SETUP.md) for:
- Installing as PWA on iPhone/iPad
- Creating a native iOS app with Capacitor
- App Store distribution

### Installation

```bash
npm install --legacy-peer-deps
```

### Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Figma API credentials (optional, only needed for design token sync):
   ```bash
   FIGMA_FILE_KEY=your_figma_file_key
   FIGMA_API_TOKEN=your_figma_api_token
   ```

3. (Optional) For OpenAI ChatKit integration, add:
   ```bash
   VITE_CHATKIT_WORKFLOW_ID=wf_your_workflow_id_here
   ```
   Get your workflow ID from [OpenAI Agent Builder](https://platform.openai.com/agent-builder)

4. (Optional) For upcoming Google/Gemini OAuth integrations, add:
   ```bash
   GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
   GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
   ```

   **Note:** The `.env` file is gitignored for security. Never commit it to version control.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## Project Structure

```
src/
├── components/     # React components
├── db/            # Database services
├── lib/           # Utilities and services
├── stores/        # Zustand stores
├── types/         # TypeScript types
└── hooks/         # Custom React hooks
```

## Design System

Design tokens are managed in `design-tokens/tokens.json` and can be synced from Figma using the GitHub Actions workflow or by running:

```bash
node scripts/sync-figma-tokens.js
```

## Security

- Never commit `.env` files containing API keys or tokens
- Use GitHub Secrets for CI/CD workflows
- All user data is stored locally in IndexedDB (no backend required)

## License

MIT
