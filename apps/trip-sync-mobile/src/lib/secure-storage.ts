import * as SecureStore from 'expo-secure-store';

// Keys for storing auth data
const AUTH_KEYS = {
  ACCESS_TOKEN: 'supabase.auth.token',
  REFRESH_TOKEN: 'supabase.auth.refresh-token',
  USER_SESSION: 'supabase.auth.user-session',
  DEVICE_ID: 'device.id',
} as const;

/**
 * Secure storage utility for sensitive authentication data
 * Uses expo-secure-store which encrypts data on device
 */
export const secureStorage = {
  /**
   * Store a value securely
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      throw error;
    }
  },

  /**
   * Retrieve a value from secure storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  },

  /**
   * Remove a value from secure storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
      throw error;
    }
  },

  /**
   * Clear all stored values
   */
  async clear(): Promise<void> {
    try {
      const promises = Object.values(AUTH_KEYS).map((key) =>
        SecureStore.deleteItemAsync(key).catch(() => {
          // Ignore errors for keys that don't exist
        })
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('SecureStorage clear error:', error);
      throw error;
    }
  },

  // Auth-specific methods
  auth: {
    async setAccessToken(token: string): Promise<void> {
      return secureStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, token);
    },

    async getAccessToken(): Promise<string | null> {
      return secureStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
    },

    async setRefreshToken(token: string): Promise<void> {
      return secureStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, token);
    },

    async getRefreshToken(): Promise<string | null> {
      return secureStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
    },

    async setUserSession(session: string): Promise<void> {
      return secureStorage.setItem(AUTH_KEYS.USER_SESSION, session);
    },

    async getUserSession(): Promise<string | null> {
      return secureStorage.getItem(AUTH_KEYS.USER_SESSION);
    },

    async setDeviceId(deviceId: string): Promise<void> {
      return secureStorage.setItem(AUTH_KEYS.DEVICE_ID, deviceId);
    },

    async getDeviceId(): Promise<string | null> {
      return secureStorage.getItem(AUTH_KEYS.DEVICE_ID);
    },

    async clearAuthData(): Promise<void> {
      const authKeys = [
        AUTH_KEYS.ACCESS_TOKEN,
        AUTH_KEYS.REFRESH_TOKEN,
        AUTH_KEYS.USER_SESSION,
      ];

      const promises = authKeys.map((key) =>
        SecureStore.deleteItemAsync(key).catch(() => {
          // Ignore errors for keys that don't exist
        })
      );

      await Promise.all(promises);
    },
  },
};

/**
 * Supabase storage adapter for expo-secure-store
 * This ensures session data is encrypted on device
 */
export const supabaseSecureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return secureStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await secureStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await secureStorage.removeItem(key);
  },
};
