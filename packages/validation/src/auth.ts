import { z } from 'zod';

import { EmailSchema, IdSchema, TimestampSchema } from './common';
import {
  isStrongPassword,
  sanitizeEmail,
  isValidUsername,
  sanitizeUsername
} from './utils';

// Password validation
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .refine(isStrongPassword, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  });

// Username validation
export const UsernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .transform(sanitizeUsername)
  .refine(isValidUsername, {
    message: 'Username can only contain letters, numbers, underscores, and hyphens',
  });

// Auth provider schema
export const AuthProviderSchema = z.enum([
  'email',
  'google',
  'apple',
  'facebook',
  'github',
  'microsoft',
  'twitter',
]);

// Login schemas
export const LoginSchema = z.object({
  email: EmailSchema.transform(sanitizeEmail),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
});

export const OAuthLoginSchema = z.object({
  provider: AuthProviderSchema,
  token: z.string().min(1),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
});

// Registration schemas
export const RegisterSchema = z
  .object({
    email: EmailSchema.transform(sanitizeEmail),
    password: PasswordSchema,
    confirmPassword: z.string(),
    name: z.string().min(2).max(100),
    username: UsernameSchema.optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
    marketingConsent: z.boolean().default(false),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Password reset schemas
export const ForgotPasswordSchema = z.object({
  email: EmailSchema.transform(sanitizeEmail),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Email verification schemas
export const VerifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const ResendVerificationSchema = z.object({
  email: EmailSchema.transform(sanitizeEmail),
});

// Two-factor authentication schemas
export const EnableTwoFactorSchema = z.object({
  password: z.string().min(1),
  method: z.enum(['authenticator', 'sms', 'email']),
});

export const VerifyTwoFactorSchema = z.object({
  code: z.string().length(6).regex(/^\d{6}$/, 'Code must be 6 digits'),
  rememberDevice: z.boolean().default(false),
  deviceId: z.string().optional(),
});

export const DisableTwoFactorSchema = z.object({
  password: z.string().min(1),
  code: z.string().length(6).regex(/^\d{6}$/, 'Code must be 6 digits'),
});

// Session management schemas
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
  deviceId: z.string().optional(),
});

export const RevokeSessionSchema = z.object({
  sessionId: IdSchema,
});

export const RevokeAllSessionsSchema = z.object({
  exceptCurrent: z.boolean().default(true),
  password: z.string().min(1),
});

// Security settings schemas
export const UpdateSecuritySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().optional(),
  loginAlerts: z.boolean().optional(),
  deviceTracking: z.boolean().optional(),
  sessionTimeout: z.number().min(5).max(1440).optional(), // minutes
  allowedIpAddresses: z.array(z.string().ip()).optional(),
});

// Device management schemas
export const TrustedDeviceSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(100),
  type: z.enum(['mobile', 'tablet', 'desktop', 'other']),
  lastUsed: TimestampSchema,
  trusted: z.boolean(),
});

export const AddTrustedDeviceSchema = z.object({
  deviceId: z.string().min(1),
  name: z.string().min(1).max(100),
  type: z.enum(['mobile', 'tablet', 'desktop', 'other']),
  fingerprint: z.string().optional(),
});

export const RemoveTrustedDeviceSchema = z.object({
  deviceId: z.string().min(1),
  password: z.string().min(1),
});

// Export types
export type Login = z.infer<typeof LoginSchema>;
export type OAuthLogin = z.infer<typeof OAuthLoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type VerifyEmail = z.infer<typeof VerifyEmailSchema>;
export type ResendVerification = z.infer<typeof ResendVerificationSchema>;
export type EnableTwoFactor = z.infer<typeof EnableTwoFactorSchema>;
export type VerifyTwoFactor = z.infer<typeof VerifyTwoFactorSchema>;
export type DisableTwoFactor = z.infer<typeof DisableTwoFactorSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type RevokeSession = z.infer<typeof RevokeSessionSchema>;
export type RevokeAllSessions = z.infer<typeof RevokeAllSessionsSchema>;
export type UpdateSecuritySettings = z.infer<typeof UpdateSecuritySettingsSchema>;
export type TrustedDevice = z.infer<typeof TrustedDeviceSchema>;
export type AddTrustedDevice = z.infer<typeof AddTrustedDeviceSchema>;
export type RemoveTrustedDevice = z.infer<typeof RemoveTrustedDeviceSchema>;
