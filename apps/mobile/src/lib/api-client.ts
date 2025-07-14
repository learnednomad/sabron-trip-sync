import NetInfo from '@react-native-community/netinfo';
import { ApiClient } from '@sabron/api-client';
import type { ApiRequestConfig } from '@sabron/types';
import { toast } from 'sonner';

import { addToOfflineQueue, processOfflineQueue } from '@/utils/offline-queue';

class ConfiguredApiClient extends ApiClient {
  constructor() {
    super(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000');
  }

  async request<T>(config: ApiRequestConfig): Promise<T> {
    const state = await NetInfo.fetch();

    if (!state.isConnected) {
      await addToOfflineQueue(config);
      throw new Error('You are offline. Request has been queued.');
    }

    try {
      const response = await super.request<T>(config);
      if (!response.success) throw new Error(response.error?.message);

      // Process queued requests when online
      await processOfflineQueue();

      return response.data!;
    } catch (error: any) {
      if (error.message.includes('offline')) {
        toast.error('You are offline. Your request has been queued.');
      } else {
        toast.error(error.message || 'Request failed');
      }
      throw error;
    }
  }
}

export const apiClient = new ConfiguredApiClient();
export * from '@sabron/api-client/hooks';
