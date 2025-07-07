import { ApiClient } from '@sabron/api-client';
import { toast } from 'sonner';

class ConfiguredApiClient extends ApiClient {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
  }

  async request<T>(...args: Parameters<ApiClient['request']>): Promise<T> {
    try {
      const response = await super.request<T>(...args);
      if (!response.success) throw new Error(response.error?.message);
      return response.data!;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      } else if (error.response?.status >= 500) {
        toast.error('Something went wrong. Please try again later.');
      }
      throw error;
    }
  }
}

export const apiClient = new ConfiguredApiClient();
export * from '@sabron/api-client/hooks';
