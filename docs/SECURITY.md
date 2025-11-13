# Security Guide for API Keys

This document outlines best practices for securely storing and managing API keys in Inkwoven.

## Overview

Inkwoven uses multiple layers of security to protect API keys:

1. **Client-side encryption** for API keys stored in localStorage
2. **GitHub Secrets** for CI/CD workflows
3. **Environment variables** for build-time configuration (optional)

## Client-Side API Key Storage

### Encryption

API keys entered in the application UI are automatically encrypted before being stored in localStorage using the Web Crypto API:

- **Algorithm**: AES-GCM (256-bit)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Storage**: Encrypted values stored in localStorage
- **Decryption**: Keys are decrypted in memory when needed

### How It Works

1. When a user enters an API key, it's encrypted using a device-specific key
2. The encrypted value is stored in localStorage
3. When the API key is needed, it's decrypted in memory
4. The decrypted key is never persisted to disk

### Security Considerations

⚠️ **Important**: Client-side encryption provides protection against:
- Accidental exposure in browser DevTools
- Basic malware that reads localStorage
- XSS attacks that access localStorage

❌ **Client-side encryption does NOT protect against**:
- Malicious browser extensions
- Advanced malware with browser access
- Server-side attacks (if you add a backend)

For maximum security, consider implementing a backend proxy that stores API keys server-side.

## GitHub Actions Secrets

For CI/CD workflows (like the Figma token sync), use GitHub Secrets:

### Setting Up Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:
   - `FIGMA_FILE_KEY`: Your Figma file key
   - `FIGMA_API_TOKEN`: Your Figma API token

### Using Secrets in Workflows

Secrets are accessed in workflow files using:

```yaml
${{ secrets.SECRET_NAME }}
```

**Never** commit secrets directly in workflow files or code.

## Environment Variables

For build-time configuration, you can use environment variables:

### Setup

1. Copy `.env.example` to `.env`
2. Add your environment variables (optional)
3. Access in code using `import.meta.env.VITE_*`

### Important Notes

- Environment variables prefixed with `VITE_` are exposed to the client
- **Never** put sensitive API keys in `VITE_*` variables if the code is public
- Use environment variables only for non-sensitive configuration

## Best Practices

### ✅ Do

- Store API keys encrypted in localStorage
- Use GitHub Secrets for CI/CD
- Rotate API keys regularly
- Use separate API keys for development and production
- Monitor API key usage for suspicious activity
- Use environment variables only for non-sensitive config

### ❌ Don't

- Commit API keys to version control
- Share API keys in plain text
- Use the same API key across multiple projects
- Store API keys in code comments
- Expose API keys in client-side environment variables (if code is public)
- Share API keys via email or chat

## Key Rotation

If an API key is compromised:

1. **Immediately** revoke the key in the provider's dashboard
2. Generate a new API key
3. Update the key in the application
4. Review access logs for suspicious activity

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email security concerns to the repository maintainers
3. Provide details about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Additional Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

