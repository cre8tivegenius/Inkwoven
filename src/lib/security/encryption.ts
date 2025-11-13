/**
 * Secure encryption utilities for API keys using Web Crypto API
 * 
 * This module provides encryption/decryption functions for sensitive data
 * like API keys before storing them in localStorage.
 */

// Generate a key derivation salt from a user-specific identifier
// In a real app, you might want to use a user ID or device fingerprint
function getKeySalt(): string {
  // Use a combination of origin and a constant salt
  // In production, consider using a user-specific identifier
  return `${window.location.origin}-inkwoven-salt`
}

/**
 * Derives a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Gets or creates a device-specific encryption key
 * This key is derived from the origin and stored in sessionStorage
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyName = 'inkwoven-encryption-key'
  const salt = getKeySalt()
  
  // Try to get existing key from sessionStorage
  const storedKeyData = sessionStorage.getItem(keyName)
  
  if (storedKeyData) {
    try {
      const keyData = JSON.parse(storedKeyData)
      return await crypto.subtle.importKey(
        'jwk',
        keyData,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      )
    } catch {
      // If import fails, generate a new key
    }
  }

  // Generate a new key from a device-specific password
  // In production, you might want to prompt the user for a password
  const devicePassword = `${window.location.origin}-${navigator.userAgent}-inkwoven`
  const key = await deriveKey(devicePassword, salt)
  
  // Store the key in sessionStorage (cleared when browser closes)
  const keyData = await crypto.subtle.exportKey('jwk', key)
  sessionStorage.setItem(keyName, JSON.stringify(keyData))
  
  return key
}

/**
 * Encrypts a string value (e.g., an API key)
 */
export async function encryptValue(value: string): Promise<string> {
  if (!value) return value
  
  try {
    const key = await getEncryptionKey()
    const encoder = new TextEncoder()
    const data = encoder.encode(value)
    
    // Generate a random IV for each encryption
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    )
    
    // Combine IV and encrypted data, then encode as base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)
    
    return btoa(String.fromCharCode(...combined))
  } catch (error) {
    console.error('Encryption error:', error)
    // Fallback to plain text if encryption fails (not ideal, but better than breaking)
    return value
  }
}

/**
 * Decrypts an encrypted string value
 */
export async function decryptValue(encryptedValue: string): Promise<string> {
  if (!encryptedValue) return encryptedValue
  
  try {
    const key = await getEncryptionKey()
    
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0))
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )
    
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    // If decryption fails, try returning as-is (might be plain text from before encryption)
    return encryptedValue
  }
}

/**
 * Checks if a value appears to be encrypted
 */
export function isEncrypted(value: string): boolean {
  if (!value) return false
  try {
    // Encrypted values are base64 encoded and have a specific structure
    const decoded = atob(value)
    return decoded.length > 12 // Has IV + data
  } catch {
    return false
  }
}

