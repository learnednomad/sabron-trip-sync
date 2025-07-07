// Common types used across the application
export type ID = string;
export type Timestamp = string; // ISO 8601
export type UUID = string;
export type Email = string;
export type URL = string;
export type Currency = string; // ISO 4217
export type CountryCode = string; // ISO 3166-1 alpha-2
export type LanguageCode = string; // ISO 639-1
export type TimeZone = string; // IANA time zone

export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: Timestamp;
  version: string;
  [key: string]: unknown;
}

export interface Money {
  amount: number;
  currency: Currency;
}

export interface DateRange {
  start: Timestamp;
  end: Timestamp;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: CountryCode;
  formatted?: string;
}

export interface Image {
  id: ID;
  url: URL;
  thumbnailUrl?: URL;
  alt?: string;
  width?: number;
  height?: number;
  size?: number; // bytes
}

export interface File {
  id: ID;
  name: string;
  url: URL;
  mimeType: string;
  size: number; // bytes
}

export type Status = 'active' | 'inactive' | 'pending' | 'archived';
export type Visibility = 'public' | 'private' | 'shared';
