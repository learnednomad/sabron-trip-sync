import type { ApiResponse, PaginationParams } from './common';

// API Request types
export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;
    response?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  };
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Endpoints
export interface ApiEndpoints {
  auth: {
    login: '/auth/login';
    logout: '/auth/logout';
    register: '/auth/register';
    refresh: '/auth/refresh';
    verify: '/auth/verify';
    forgotPassword: '/auth/forgot-password';
    resetPassword: '/auth/reset-password';
  };
  users: {
    me: '/users/me';
    list: '/users';
    byId: '/users/:id';
    update: '/users/:id';
    delete: '/users/:id';
    uploadAvatar: '/users/:id/avatar';
  };
  itineraries: {
    list: '/itineraries';
    create: '/itineraries';
    byId: '/itineraries/:id';
    update: '/itineraries/:id';
    delete: '/itineraries/:id';
    share: '/itineraries/:id/share';
    collaborate: '/itineraries/:id/collaborate';
  };
  activities: {
    list: '/itineraries/:itineraryId/activities';
    create: '/itineraries/:itineraryId/activities';
    byId: '/activities/:id';
    update: '/activities/:id';
    delete: '/activities/:id';
    reorder: '/activities/reorder';
  };
}

// Query keys for React Query
export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: PaginationParams) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  itineraries: {
    all: ['itineraries'] as const,
    lists: () => [...queryKeys.itineraries.all, 'list'] as const,
    list: (params: PaginationParams) => [...queryKeys.itineraries.lists(), params] as const,
    details: () => [...queryKeys.itineraries.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.itineraries.details(), id] as const,
  },
  activities: {
    all: ['activities'] as const,
    lists: () => [...queryKeys.activities.all, 'list'] as const,
    list: (itineraryId: string, params?: PaginationParams) =>
      [...queryKeys.activities.lists(), itineraryId, params] as const,
    details: () => [...queryKeys.activities.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.activities.details(), id] as const,
  },
} as const;

// Request/Response types
export interface CreateItinerary {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  budget?: {
    currency: string;
    amount: number;
  };
  visibility: 'public' | 'private' | 'shared';
  tags?: string[];
}

export interface UpdateItinerary {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  destinations?: string[];
  budget?: {
    currency: string;
    amount: number;
  };
  visibility?: 'public' | 'private' | 'shared';
  tags?: string[];
}

export interface SearchItineraries {
  query?: string;
  destinations?: string[];
  startDate?: string;
  endDate?: string;
  minBudget?: number;
  maxBudget?: number;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface CreateActivity {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  category: string;
  subcategory?: string;
  priority: 'low' | 'medium' | 'high';
  cost?: {
    currency: string;
    amount: number;
  };
  notes?: string;
  tags?: string[];
}

export interface UpdateActivity {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  category?: string;
  subcategory?: string;
  priority?: 'low' | 'medium' | 'high';
  cost?: {
    currency: string;
    amount: number;
  };
  notes?: string;
  tags?: string[];
}

export interface SearchActivities {
  query?: string;
  category?: string;
  subcategory?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}
