import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiRequestConfig, ApiResponse } from '@sabron/types';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
        }
        return Promise.reject(error);
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
      return {
        success: true,
        data: response.data,
        metadata: {
          requestId: response.headers['x-request-id'] || '',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.message || error.message,
          details: error.response?.data?.details,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          statusCode: error.response?.status || 500,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  get<T>(url: string, config?: ApiRequestConfig) {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  post<T>(url: string, data?: any, config?: ApiRequestConfig) {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  put<T>(url: string, data?: any, config?: ApiRequestConfig) {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  patch<T>(url: string, data?: any, config?: ApiRequestConfig) {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  delete<T>(url: string, config?: ApiRequestConfig) {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
