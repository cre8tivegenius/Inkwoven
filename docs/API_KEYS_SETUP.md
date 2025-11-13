# How to Add API Keys to Inkwoven

This guide will walk you through adding API keys for AI providers and setting up GitHub Secrets for CI/CD workflows.

## Adding AI Provider API Keys in the App

### Step 1: Open the AI Sidebar
1. Launch the Inkwoven application
2. Look for the **AI Assistant** button or icon in the interface
3. Click to open the AI Sidebar

### Step 2: Access Settings
1. In the AI Sidebar, click the **Settings** icon (⚙️) in the top-right corner
2. This will reveal the API key input fields

### Step 3: Enter Your API Keys
For each AI provider you want to use:

1. **OpenAI**:
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Sign in or create an account
   - Click "Create new secret key"
   - Copy the key (you won't be able to see it again!)
   - Paste it into the OpenAI field in Inkwoven

2. **Anthropic (Claude)**:
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Sign in or create an account
   - Navigate to API Keys section
   - Click "Create Key"
   - Copy the key and paste it into the Anthropic field in Inkwoven

3. **Google Gemini**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key and paste it into the Google Gemini field in Inkwoven

### Step 4: Activate a Provider
1. After entering an API key, click the **"Use"** button next to that provider
2. The selected provider will be highlighted
3. You can now use the AI Assistant with that provider

### Step 5: Verify It Works
1. Type a message in the AI Assistant input field
2. Click send or press Enter
3. If configured correctly, you'll receive a response from the AI

**Note**: Your API keys are automatically encrypted before being stored in your browser's localStorage. They're only decrypted in memory when needed.

---

## Setting Up GitHub Secrets for CI/CD

If you want to use the Figma design token sync workflow, you'll need to set up GitHub Secrets.

### Step 1: Get Your Figma Credentials

1. **Figma File Key**:
   - Open your Figma file
   - Look at the URL: `https://www.figma.com/file/[FILE_KEY]/...`
   - The `FILE_KEY` is the long string between `/file/` and the file name
   - Copy this value

2. **Figma API Token**:
   - Go to [Figma Account Settings](https://www.figma.com/settings)
   - Scroll down to "Personal access tokens"
   - Click "Create new token"
   - Give it a name (e.g., "Inkwoven Token Sync")
   - Copy the token immediately (you won't see it again!)

### Step 2: Add Secrets to GitHub

1. **Navigate to Repository Settings**:
   - Go to your GitHub repository
   - Click on **Settings** (top menu)
   - In the left sidebar, click **Secrets and variables** → **Actions**

2. **Add FIGMA_FILE_KEY**:
   - Click **New repository secret**
   - Name: `FIGMA_FILE_KEY`
   - Secret: Paste your Figma file key
   - Click **Add secret**

3. **Add FIGMA_API_TOKEN**:
   - Click **New repository secret** again
   - Name: `FIGMA_API_TOKEN`
   - Secret: Paste your Figma API token
   - Click **Add secret**

### Step 3: Verify the Workflow

1. Go to the **Actions** tab in your repository
2. You should see the "Sync Design Tokens" workflow
3. You can manually trigger it by:
   - Going to Actions → Sync Design Tokens
   - Clicking "Run workflow"
   - Selecting the branch (usually `main`)
   - Clicking "Run workflow"

The workflow will run automatically on weekdays at 6 AM, or you can trigger it manually anytime.

---

## Security Best Practices

### ✅ Do:
- Keep your API keys private
- Use different keys for development and production
- Rotate keys regularly (every 90 days recommended)
- Monitor your API usage for unexpected activity
- Revoke keys immediately if compromised

### ❌ Don't:
- Share API keys in screenshots or messages
- Commit API keys to version control
- Use the same key across multiple projects
- Leave keys in code comments
- Share your GitHub account credentials

---

## Troubleshooting

### "Invalid API Key" Error
- Double-check that you copied the entire key
- Make sure there are no extra spaces
- Verify the key is still active in the provider's dashboard
- Try generating a new key

### Keys Not Saving
- Check browser console for errors
- Ensure localStorage is enabled in your browser
- Try clearing browser cache and re-entering keys
- Check if you're in private/incognito mode (may have restrictions)

### GitHub Workflow Failing
- Verify secrets are set correctly in GitHub Settings
- Check the workflow logs in the Actions tab
- Ensure the Figma file key and token are correct
- Make sure the Figma file is accessible with the provided token

### Encryption Issues
- The app will fall back to unencrypted storage if encryption fails
- Check browser console for encryption errors
- Ensure you're using a modern browser with Web Crypto API support
- Try refreshing the page

---

## Need Help?

- Check the [Security Documentation](./SECURITY.md) for more details
- Review the [Main README](../README.md) for general setup
- Open an issue on GitHub if you encounter bugs

