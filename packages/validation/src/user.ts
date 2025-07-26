import { z } from 'zod';

import { UsernameSchema } from './auth';
import {
  EmailSchema,
  PhoneNumberSchema,
  UrlSchema,
  CountryCodeSchema,
  LanguageCodeSchema,
  CurrencySchema,
  AddressSchema,
} from './common';
import { AccommodationTypeSchema } from './itinerary';
import { sanitizeHtml } from './utils';

// User preference schemas
export const BudgetLevelSchema = z.enum(['budget', 'moderate', 'luxury', 'ultra-luxury']);

export const InterestSchema = z.enum([
  'adventure',
  'culture',
  'food',
  'nature',
  'shopping',
  'nightlife',
  'history',
  'art',
  'sports',
  'wellness',
  'photography',
  'architecture',
  'beaches',
  'mountains',
  'urban',
  'rural',
]);

export const TravelStyleSchema = z.enum(['solo', 'couple', 'family', 'group', 'business']);



export const DietaryRestrictionSchema = z.enum([
  'vegetarian',
  'vegan',
  'gluten-free',
  'halal',
  'kosher',
  'other',
]);

export const AccessibilityNeedSchema = z.enum([
  'wheelchair',
  'visual',
  'hearing',
  'cognitive',
  'other',
]);

// Notification preferences
export const NotificationPreferencesSchema = z.object({
  marketing: z.boolean().default(false),
  itineraryUpdates: z.boolean().default(true),
  collaborationRequests: z.boolean().default(true),
  reviewReminders: z.boolean().default(true),
  priceAlerts: z.boolean().default(true),
  travelAlerts: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),
});

// Travel preferences
export const TravelPreferencesSchema = z.object({
  budget: BudgetLevelSchema.default('moderate'),
  interests: z.array(InterestSchema).default([]),
  travelStyle: TravelStyleSchema.default('solo'),
  accommodationType: z.array(AccommodationTypeSchema).default(['hotel']),
  dietaryRestrictions: z.array(DietaryRestrictionSchema).default([]),
  accessibilityNeeds: z.array(AccessibilityNeedSchema).default([]),
  preferredAirlines: z.array(z.string()).default([]),
  preferredHotelChains: z.array(z.string()).default([]),
  passportInfo: z
    .object({
      number: z.string().optional(),
      issuingCountry: CountryCodeSchema,
      expirationDate: z.string().date(),
      visas: z
        .array(
          z.object({
            country: CountryCodeSchema,
            type: z.string(),
            expirationDate: z.string().date(),
          })
        )
        .optional(),
    })
    .optional(),
});

// User preferences
export const UserPreferencesSchema = z.object({
  language: LanguageCodeSchema.default('en'),
  currency: CurrencySchema.default('USD'),
  timezone: z.string().default('UTC'),
  dateFormat: z.string().default('MM/DD/YYYY'),
  timeFormat: z.enum(['12h', '24h']).default('12h'),
  measurementUnit: z.enum(['metric', 'imperial']).default('metric'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  emailNotifications: NotificationPreferencesSchema,
  pushNotifications: NotificationPreferencesSchema,
  travelPreferences: TravelPreferencesSchema,
});

// Social media
export const SocialMediaSchema = z.object({
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  youtube: z.string().url().optional(),
  tiktok: z.string().url().optional(),
});

// Emergency contact
export const EmergencyContactSchema = z.object({
  name: z.string().min(1).max(100),
  relationship: z.string().min(1).max(50),
  phoneNumber: PhoneNumberSchema,
  email: EmailSchema.optional(),
});

// User profile
export const UserProfileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  displayName: z.string().min(1).max(100).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  nationality: CountryCodeSchema.optional(),
  languages: z.array(LanguageCodeSchema).default(['en']),
  occupation: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  website: UrlSchema.optional(),
  socialMedia: SocialMediaSchema.optional(),
  emergencyContact: EmergencyContactSchema.optional(),
  address: AddressSchema.optional(),
});

// Privacy settings
export const PrivacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'friends', 'private']).default('private'),
  showEmail: z.boolean().default(false),
  showPhoneNumber: z.boolean().default(false),
  showLocation: z.boolean().default(false),
  allowFriendRequests: z.boolean().default(true),
  allowMessages: z.boolean().default(true),
  blockList: z.array(z.string().uuid()).default([]),
});

// Data sharing settings
export const DataSharingSettingsSchema = z.object({
  analytics: z.boolean().default(true),
  personalizedAds: z.boolean().default(false),
  thirdPartySharing: z.boolean().default(false),
  dataExport: z.boolean().default(true),
});

// Accessibility settings
export const AccessibilitySettingsSchema = z.object({
  highContrast: z.boolean().default(false),
  largeText: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
  screenReaderOptimized: z.boolean().default(false),
  keyboardNavigation: z.boolean().default(true),
});

// User settings
export const UserSettingsSchema = z.object({
  privacy: PrivacySettingsSchema,
  dataSharing: DataSharingSettingsSchema,
  accessibility: AccessibilitySettingsSchema,
});

// Create user schema
export const CreateUserSchema = z.object({
  email: EmailSchema,
  name: z.string().min(2).max(100),
  username: UsernameSchema.optional(),
  bio: z.string().max(500).transform(sanitizeHtml).optional(),
  phoneNumber: PhoneNumberSchema.optional(),
  preferences: UserPreferencesSchema.optional(),
  profile: UserProfileSchema.optional(),
  settings: UserSettingsSchema.optional(),
});

// Update user schema
export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  username: UsernameSchema.optional(),
  bio: z.string().max(500).transform(sanitizeHtml).optional(),
  avatar: UrlSchema.optional(),
  coverImage: UrlSchema.optional(),
  dateOfBirth: z.string().date().optional(),
  phoneNumber: PhoneNumberSchema.optional(),
  preferences: UserPreferencesSchema.partial().optional(),
  profile: UserProfileSchema.partial().optional(),
  settings: UserSettingsSchema.partial().optional(),
});

// User search schema
export const SearchUsersSchema = z.object({
  query: z.string().min(1).max(100),
  filters: z
    .object({
      interests: z.array(InterestSchema).optional(),
      travelStyle: TravelStyleSchema.optional(),
      languages: z.array(LanguageCodeSchema).optional(),
      countries: z.array(CountryCodeSchema).optional(),
      verified: z.boolean().optional(),
    })
    .optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
});

// Follow/unfollow schemas
export const FollowUserSchema = z.object({
  userId: z.string().uuid(),
  notify: z.boolean().default(true),
});

export const UnfollowUserSchema = z.object({
  userId: z.string().uuid(),
});

// Block/unblock schemas
export const BlockUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export const UnblockUserSchema = z.object({
  userId: z.string().uuid(),
});

// Report user schema
export const ReportUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.enum([
    'spam',
    'harassment',
    'inappropriate-content',
    'impersonation',
    'scam',
    'other',
  ]),
  description: z.string().min(10).max(1000),
  evidence: z.array(UrlSchema).max(5).optional(),
});

// Export types
export type BudgetLevel = z.infer<typeof BudgetLevelSchema>;
export type Interest = z.infer<typeof InterestSchema>;
export type TravelStyle = z.infer<typeof TravelStyleSchema>;
export type DietaryRestriction = z.infer<typeof DietaryRestrictionSchema>;
export type AccessibilityNeed = z.infer<typeof AccessibilityNeedSchema>;
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;
export type TravelPreferences = z.infer<typeof TravelPreferencesSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type EmergencyContact = z.infer<typeof EmergencyContactSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;
export type DataSharingSettings = z.infer<typeof DataSharingSettingsSchema>;
export type AccessibilitySettings = z.infer<typeof AccessibilitySettingsSchema>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type SearchUsers = z.infer<typeof SearchUsersSchema>;
export type FollowUser = z.infer<typeof FollowUserSchema>;
export type UnfollowUser = z.infer<typeof UnfollowUserSchema>;
export type BlockUser = z.infer<typeof BlockUserSchema>;
export type UnblockUser = z.infer<typeof UnblockUserSchema>;
export type ReportUser = z.infer<typeof ReportUserSchema>;
