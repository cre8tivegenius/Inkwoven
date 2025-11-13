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
- Sidebar with user-managed API credentials
- Support for OpenAI, Anthropic, and Google Gemini
- Streaming responses
- Context-aware assistance with selected text
- **Secure encrypted storage** for API keys

### Templates
- Journal, Letter, Poetry, Story, and Blank templates
- Template selector with previews

### Creative Tools
- Morning exercises with preset and AI-generated prompts
- Image attachments with drag-and-drop
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

### Installation

```bash
npm install --legacy-peer-deps
```

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

Design tokens are managed in `design-tokens/tokens.json` and can be synced from Figma using the GitHub Actions workflow.

## Configuration

### Adding API Keys

To use the AI Writing Assistant, you'll need to add API keys for your preferred providers:

1. **In the App**: Open the AI Sidebar → Settings → Enter your API keys
   - Keys are automatically encrypted before storage
   - See [API Keys Setup Guide](./docs/API_KEYS_SETUP.md) for detailed instructions

2. **GitHub Secrets** (for CI/CD): Set up Figma tokens for design token sync
   - Go to Repository Settings → Secrets and variables → Actions
   - Add `FIGMA_FILE_KEY` and `FIGMA_API_TOKEN`
   - See [API Keys Setup Guide](./docs/API_KEYS_SETUP.md) for step-by-step instructions

### Security

- API keys are encrypted using Web Crypto API before storage
- Keys are only decrypted in memory when needed
- See [Security Documentation](./docs/SECURITY.md) for best practices

## License

MIT
