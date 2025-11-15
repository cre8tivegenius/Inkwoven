#!/bin/bash
# Setup script to create .env file from .env.example

if [ -f .env ]; then
  echo "⚠️  .env file already exists. Skipping setup."
  exit 0
fi

if [ ! -f .env.example ]; then
  echo "❌ .env.example not found. Cannot create .env file."
  exit 1
fi

cp .env.example .env
echo "✅ Created .env file from .env.example"
echo "📝 Please edit .env and add your API keys:"
echo "   - FIGMA_FILE_KEY"
echo "   - FIGMA_API_TOKEN"
echo "   - GOOGLE_OAUTH_CLIENT_ID (for Google/Gemini OAuth)"
echo "   - GOOGLE_OAUTH_CLIENT_SECRET (for Google/Gemini OAuth)"
echo ""
echo "⚠️  Remember: .env is gitignored and should never be committed!"

