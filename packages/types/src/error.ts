export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date | string;
  requestId?: string;
  statusCode?: number;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ErrorResponse {
  success: false;
  error: APIError;
  validation?: ValidationError[];
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export type APIResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];