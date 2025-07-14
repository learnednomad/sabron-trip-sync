import type { Role, SecuritySettings } from './auth';
import type { BaseEntity, ID, Email, URL, CountryCode, LanguageCode, Currency, Timestamp } from './common';
import type { AccommodationType } from './itinerary';
import type { EmergencyContact } from './location';
import type { NotificationPreferences } from './notification';
import type { PaymentMethod } from './payment';

export interface User extends BaseEntity {
  email: Email;
  name: string;
  username?: string;
  bio?: string;
  avatar?: URL;
  coverImage?: URL;
  dateOfBirth?: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  preferences: UserPreferences;
  profile: UserProfile;
  settings: UserSettings;
  subscription: UserSubscription;
  roles: Role[];
  isActive: boolean;
  lastActiveAt?: Timestamp;
}

export interface UserPreferences {
  language: LanguageCode;
  currency: Currency;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  measurementUnit: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'system';
  emailNotifications: NotificationPreferences;
  pushNotifications: NotificationPreferences;
  travelPreferences: TravelPreferences;
}



export interface TravelPreferences {
  budget: BudgetLevel;
  interests: Interest[];
  travelStyle: TravelStyle;
  accommodationType: AccommodationType[];
  dietaryRestrictions: DietaryRestriction[];
  accessibilityNeeds: AccessibilityNeed[];
  preferredAirlines: string[];
  preferredHotelChains: string[];
  passportInfo?: PassportInfo;
}

export type BudgetLevel = 'budget' | 'moderate' | 'luxury' | 'ultra-luxury';
export type Interest =
  | 'adventure'
  | 'culture'
  | 'food'
  | 'nature'
  | 'shopping'
  | 'nightlife'
  | 'history'
  | 'art'
  | 'sports'
  | 'wellness'
  | 'photography'
  | 'architecture'
  | 'beaches'
  | 'mountains'
  | 'urban'
  | 'rural';

export type TravelStyle = 'solo' | 'couple' | 'family' | 'group' | 'business';

export type DietaryRestriction = 'vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'kosher' | 'other';
export type AccessibilityNeed = 'wheelchair' | 'visual' | 'hearing' | 'cognitive' | 'other';

export interface PassportInfo {
  number: string;
  issuingCountry: CountryCode;
  expirationDate: string;
  visas?: Visa[];
}

export interface Visa {
  country: CountryCode;
  type: string;
  expirationDate: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  nationality?: CountryCode;
  languages: LanguageCode[];
  occupation?: string;
  company?: string;
  website?: URL;
  socialMedia?: SocialMedia;
  emergencyContact?: EmergencyContact;
  address?: UserAddress;
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}



export interface UserAddress {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: CountryCode;
}

export interface UserSettings {
  privacy: PrivacySettings;
  security: SecuritySettings;
  dataSharing: DataSharingSettings;
  accessibility: AccessibilitySettings;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhoneNumber: boolean;
  showLocation: boolean;
  allowFriendRequests: boolean;
  allowMessages: boolean;
  blockList: ID[];
}

export interface DataSharingSettings {
  analytics: boolean;
  personalizedAds: boolean;
  thirdPartySharing: boolean;
  dataExport: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: Timestamp;
  endDate?: Timestamp;
  autoRenew: boolean;
  paymentMethod?: PaymentMethod;
  billingHistory: BillingRecord[];
}

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'business';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';



export interface BillingRecord {
  id: ID;
  amount: number;
  currency: Currency;
  date: Timestamp;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: URL;
}

export interface UserStats {
  itinerariesCreated: number;
  placesVisited: number;
  countriesVisited: number;
  totalDistance: number;
  totalDays: number;
  reviewsWritten: number;
  photosUploaded: number;
  followersCount: number;
  followingCount: number;
}
