import { z } from 'zod';

import { isValidPhoneNumber } from './utils';

// Common schemas used across the application
export const IdSchema = z.string().uuid();
export const TimestampSchema = z.string().datetime();
export const EmailSchema = z.string().email().toLowerCase();
export const UrlSchema = z.string().url();
export const CurrencySchema = z.string().length(3).regex(/^[A-Z]{3}$/);
export const CountryCodeSchema = z.string().length(2).regex(/^[A-Z]{2}$/);
export const LanguageCodeSchema = z.string().length(2).regex(/^[a-z]{2}$/);
export const TimeZoneSchema = z.string();

export const PhoneNumberSchema = z
  .string()
  .refine(isValidPhoneNumber, { message: 'Invalid phone number format' });

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const DateRangeSchema = z
  .object({
    start: TimestampSchema,
    end: TimestampSchema,
  })
  .refine((data) => new Date(data.start) <= new Date(data.end), {
    message: 'Start date must be before or equal to end date',
    path: ['end'],
  });

export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const AddressSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: CountryCodeSchema,
  formatted: z.string().optional(),
});

export const MoneySchema = z.object({
  amount: z.number().nonnegative().multipleOf(0.01),
  currency: CurrencySchema,
});

export const ImageSchema = z.object({
  id: IdSchema,
  url: UrlSchema,
  thumbnailUrl: UrlSchema.optional(),
  alt: z.string().max(500).optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  size: z.number().positive().optional(),
});

export const FileSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(255),
  url: UrlSchema,
  mimeType: z.string(),
  size: z.number().positive(),
});

// Search and filter schemas
export const SearchSchema = z.object({
  query: z.string().min(1).max(200),
  filters: z.record(z.unknown()).optional(),
  pagination: PaginationSchema.optional(),
});

export const FilterOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'greater_than',
  'greater_than_or_equal',
  'less_than',
  'less_than_or_equal',
  'between',
  'in',
  'not_in',
  'is_null',
  'is_not_null',
]);

export const FilterSchema = z.object({
  field: z.string(),
  operator: FilterOperatorSchema,
  value: z.unknown(),
  combine: z.enum(['and', 'or']).default('and'),
});

export const SortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']),
});

// Batch operation schemas
export const BatchOperationSchema = z.object({
  ids: z.array(IdSchema).min(1).max(100),
  operation: z.enum(['delete', 'archive', 'restore', 'update']),
  data: z.record(z.unknown()).optional(),
});

export const BulkResponseSchema = z.object({
  successful: z.array(IdSchema),
  failed: z.array(
    z.object({
      id: IdSchema,
      error: z.string(),
    })
  ),
  total: z.number(),
  successCount: z.number(),
  failureCount: z.number(),
});

// File upload schemas
export const FileUploadSchema = z.object({
  filename: z.string().max(255),
  mimeType: z.string(),
  size: z.number().positive().max(100 * 1024 * 1024), // 100MB max
  data: z.string().optional(), // Base64 encoded
  url: UrlSchema.optional(),
});

export const ImageUploadSchema = FileUploadSchema.extend({
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  size: z.number().positive().max(10 * 1024 * 1024), // 10MB max for images
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

// Notification preference schemas
export const NotificationChannelSchema = z.enum(['email', 'push', 'sms', 'in-app']);

export const NotificationPreferenceSchema = z.object({
  channel: NotificationChannelSchema,
  enabled: z.boolean(),
  frequency: z.enum(['realtime', 'daily', 'weekly', 'never']).optional(),
});

// Export types
export type Pagination = z.infer<typeof PaginationSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Money = z.infer<typeof MoneySchema>;
export type Image = z.infer<typeof ImageSchema>;
export type File = z.infer<typeof FileSchema>;
export type Search = z.infer<typeof SearchSchema>;
export type Filter = z.infer<typeof FilterSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type BatchOperation = z.infer<typeof BatchOperationSchema>;
export type BulkResponse = z.infer<typeof BulkResponseSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ImageUpload = z.infer<typeof ImageUploadSchema>;
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;
export type NotificationPreference = z.infer<typeof NotificationPreferenceSchema>;
