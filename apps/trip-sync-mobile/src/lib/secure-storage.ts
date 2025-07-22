import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { MMKV } from 'react-native-mmkv';

const ENCRYPTION_KEY_ALIAS = 'supabase_mmkv_encryption_key';

// Create or retrieve encryption key from SecureStore
async function getOrCreateEncryptionKey(): Promise<string> {
  try {
    // Try to get existing key
    const existingKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_ALIAS);
    if (existingKey) {
      return existingKey;
    }

    // Generate new encryption key if none exists
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    const encryptionKey = btoa(
      String.fromCharCode(...new Uint8Array(randomBytes))
    );

    // Store the key securely
    await SecureStore.setItemAsync(ENCRYPTION_KEY_ALIAS, encryptionKey);

    return encryptionKey;
  } catch (error) {
    console.error('Error managing encryption key:', error);
    // Fallback to a default key if SecureStore fails (not recommended for production)
    return 'fallback_encryption_key_should_be_replaced';
  }
}

// Create encrypted MMKV instance
let authStorage: MMKV | null = null;

export async function getSecureAuthStorage(): Promise<MMKV> {
  if (!authStorage) {
    const encryptionKey = await getOrCreateEncryptionKey();
    authStorage = new MMKV({
      id: 'supabase-auth-storage',
      encryptionKey: encryptionKey,
    });
  }
  return authStorage;
}

// Storage adapter for Supabase that uses encrypted MMKV
export const SecureMMKVAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    const storage = await getSecureAuthStorage();
    return storage.getString(key) ?? null;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    const storage = await getSecureAuthStorage();
    storage.set(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    const storage = await getSecureAuthStorage();
    storage.delete(key);
  },
};

// Utility to clear all auth data (useful for logout)
export async function clearAuthStorage(): Promise<void> {
  const storage = await getSecureAuthStorage();
  storage.clearAll();
}
