import type { BaseEntity, ID, Email, Timestamp } from './common';

export interface AuthUser {
  id: ID;
  email: Email;
  emailVerified: boolean;
  provider: AuthProvider;
  lastLogin?: Timestamp;
}

export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook' | 'github';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: Timestamp;
  user: AuthUser;
}

export interface LoginCredentials {
  email: Email;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: Email;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export interface OAuthCredentials {
  provider: AuthProvider;
  token: string;
}

export interface PasswordResetRequest {
  email: Email;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export interface EmailVerification {
  token: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface Permission {
  id: ID;
  name: string;
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: Permission[];
  isSystem: boolean;
}

export interface UserSession extends BaseEntity {
  userId: ID;
  token: string;
  expiresAt: Timestamp;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  isActive: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'sms' | 'authenticator' | 'email';
  passwordLastChanged?: Timestamp;
  securityQuestions?: Array<{
    question: string;
    answerHash: string;
  }>;
  trustedDevices?: Array<{
    id: string;
    name: string;
    lastUsed: Timestamp;
  }>;
}
