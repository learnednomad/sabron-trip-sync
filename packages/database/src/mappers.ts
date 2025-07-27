import type {
  UserWithProfile,
  UserRow,
  ItineraryRow,
  ActivityRow,
  ExpenseRow,
  UserProfileRow,
  UserPreferencesRow,
  UserSettingsRow,
} from './helpers';

/**
 * Simple type mappers to convert between database types and basic application formats
 * These provide minimal transformation and avoid complex type mapping issues
 */

// Simple interface for basic user data (avoiding conflicts with @sabron/types)
export interface SimpleUser {
  id: string;
  email: string;
  username?: string;
  name: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
  isVerified: boolean;
  isActive: boolean;
  timezone?: string;
}

export interface SimpleUserProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gender?: string;
  website?: string;
  socialMedia?: Record<string, unknown>;
}

export interface SimpleUserPreferences {
  userId: string;
  language?: string;
  currency?: string;
  timezone?: string;
  dateFormat?: string;
  measurementUnit?: string;
  theme?: string;
  timeFormat?: string;
}

export interface SimpleUserSettings {
  userId: string;
  accessibility?: Record<string, unknown>;
  privacy?: Record<string, unknown>;
  security?: Record<string, unknown>;
  dataSharing?: Record<string, unknown>;
}

// User mappers
export function mapUserRowToSimpleUser(userRow: UserRow): SimpleUser {
  return {
    id: userRow.id,
    email: userRow.email,
    username: userRow.username || undefined,
    name: userRow.name,
    profilePictureUrl: userRow.profile_picture_url || undefined,
    createdAt: userRow.created_at || new Date().toISOString(),
    updatedAt: userRow.updated_at || new Date().toISOString(),
    lastActivityAt: userRow.last_activity_at || undefined,
    isVerified: userRow.is_verified || false,
    isActive: userRow.is_active || true,
    timezone: userRow.timezone || undefined,
  };
}

export function mapUserWithProfileToSimpleUser(userWithProfile: UserWithProfile): SimpleUser & {
  profile?: SimpleUserProfile;
  preferences?: SimpleUserPreferences;
  settings?: SimpleUserSettings;
} {
  const baseUser = mapUserRowToSimpleUser(userWithProfile);
  
  return {
    ...baseUser,
    profile: userWithProfile.user_profiles ? mapUserProfileRowToSimpleProfile(userWithProfile.user_profiles) : undefined,
    preferences: userWithProfile.user_preferences ? mapUserPreferencesRowToSimplePreferences(userWithProfile.user_preferences) : undefined,
    settings: userWithProfile.user_settings ? mapUserSettingsRowToSimpleSettings(userWithProfile.user_settings) : undefined,
  };
}

// User profile mappers
export function mapUserProfileRowToSimpleProfile(profileRow: UserProfileRow): SimpleUserProfile {
  return {
    userId: profileRow.user_id,
    firstName: profileRow.first_name || undefined,
    lastName: profileRow.last_name || undefined,
    displayName: profileRow.display_name || undefined,
    gender: profileRow.gender || undefined,
    website: profileRow.website || undefined,
    socialMedia: profileRow.social_media as Record<string, unknown> || undefined,
  };
}

// User preferences mappers
export function mapUserPreferencesRowToSimplePreferences(preferencesRow: UserPreferencesRow): SimpleUserPreferences {
  return {
    userId: preferencesRow.user_id,
    language: preferencesRow.language || undefined,
    currency: preferencesRow.currency || undefined,
    timezone: preferencesRow.timezone || undefined,
    dateFormat: preferencesRow.date_format || undefined,
    measurementUnit: preferencesRow.measurement_unit || undefined,
    theme: preferencesRow.theme || undefined,
    timeFormat: preferencesRow.time_format || undefined,
  };
}

// User settings mappers
export function mapUserSettingsRowToSimpleSettings(settingsRow: UserSettingsRow): SimpleUserSettings {
  return {
    userId: settingsRow.user_id,
    accessibility: settingsRow.accessibility as Record<string, unknown> || undefined,
    privacy: settingsRow.privacy as Record<string, unknown> || undefined,
    security: settingsRow.security as Record<string, unknown> || undefined,
    dataSharing: settingsRow.data_sharing as Record<string, unknown> || undefined,
  };
}

// Reverse mappers (Simple types to Database types)
export function mapSimpleUserToUserInsert(user: Partial<SimpleUser>): Partial<UserRow> {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    profile_picture_url: user.profilePictureUrl,
    is_verified: user.isVerified,
    is_active: user.isActive,
    timezone: user.timezone,
  };
}

export function mapSimpleUserProfileToInsert(profile: Partial<SimpleUserProfile>) {
  return {
    user_id: profile.userId,
    first_name: profile.firstName,
    last_name: profile.lastName,
    display_name: profile.displayName,
    gender: profile.gender,
    website: profile.website,
    social_media: profile.socialMedia,
  };
}

export function mapSimpleUserPreferencesToInsert(preferences: Partial<SimpleUserPreferences>) {
  return {
    user_id: preferences.userId,
    language: preferences.language,
    currency: preferences.currency,
    timezone: preferences.timezone,
    date_format: preferences.dateFormat,
    measurement_unit: preferences.measurementUnit,
    theme: preferences.theme,
    time_format: preferences.timeFormat,
  };
}

export function mapSimpleUserSettingsToInsert(settings: Partial<SimpleUserSettings>) {
  return {
    user_id: settings.userId,
    accessibility: settings.accessibility,
    privacy: settings.privacy,
    security: settings.security,
    data_sharing: settings.dataSharing,
  };
}

// Simple itinerary mapper
export interface SimpleItinerary {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  destination: string;
  startDate: string;
  endDate: string;
  status?: string;
  visibility?: string;
  tags: string[];
  budget?: number;
  currency?: string;
  groupSize?: number;
  travelStyle?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export function mapItineraryRowToSimple(itineraryRow: ItineraryRow): SimpleItinerary {
  return {
    id: itineraryRow.id,
    userId: itineraryRow.user_id,
    title: itineraryRow.title,
    description: itineraryRow.description || undefined,
    coverImageUrl: itineraryRow.cover_image_url || undefined,
    destination: itineraryRow.destination,
    startDate: itineraryRow.start_date,
    endDate: itineraryRow.end_date,
    status: itineraryRow.status || undefined,
    visibility: itineraryRow.visibility || undefined,
    tags: (itineraryRow.tags as string[]) || [],
    budget: itineraryRow.budget || undefined,
    currency: itineraryRow.currency || undefined,
    groupSize: itineraryRow.group_size || undefined,
    travelStyle: itineraryRow.travel_style || undefined,
    metadata: (itineraryRow.metadata as Record<string, unknown>) || undefined,
    createdAt: itineraryRow.created_at || new Date().toISOString(),
    updatedAt: itineraryRow.updated_at || new Date().toISOString(),
  };
}

// Simple activity mapper
export interface SimpleActivity {
  id: string;
  itineraryId: string;
  title: string;
  description?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  cost?: number;
  currency?: string;
  bookingUrl?: string;
  confirmationNumber?: string;
  notes?: string;
  photos: string[];
  rating?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export function mapActivityRowToSimple(activityRow: ActivityRow): SimpleActivity {
  return {
    id: activityRow.id,
    itineraryId: activityRow.itinerary_id,
    title: activityRow.title,
    description: activityRow.description || undefined,
    category: activityRow.category || undefined,
    startTime: activityRow.start_time || undefined,
    endTime: activityRow.end_time || undefined,
    durationMinutes: activityRow.duration_minutes || undefined,
    location: activityRow.location || undefined,
    address: activityRow.address || undefined,
    latitude: activityRow.latitude || undefined,
    longitude: activityRow.longitude || undefined,
    cost: activityRow.cost || undefined,
    currency: activityRow.currency || undefined,
    bookingUrl: activityRow.booking_url || undefined,
    confirmationNumber: activityRow.confirmation_number || undefined,
    notes: activityRow.notes || undefined,
    photos: (activityRow.photos as string[]) || [],
    rating: activityRow.rating || undefined,
    metadata: (activityRow.metadata as Record<string, unknown>) || undefined,
    createdAt: activityRow.created_at || new Date().toISOString(),
    updatedAt: activityRow.updated_at || new Date().toISOString(),
  };
}

// Simple expense mapper
export interface SimpleExpense {
  id: string;
  itineraryId?: string;
  activityId?: string;
  userId: string;
  amount: number;
  currency?: string;
  description: string;
  category: string;
  subcategory?: string;
  merchantName?: string;
  paymentMethod?: string;
  receipt?: Record<string, unknown>;
  notes?: string;
  tags: string[];
  isBusinessExpense?: boolean;
  isRecurring?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function mapExpenseRowToSimple(expenseRow: ExpenseRow): SimpleExpense {
  return {
    id: expenseRow.id,
    itineraryId: expenseRow.itinerary_id || undefined,
    activityId: expenseRow.activity_id || undefined,
    userId: expenseRow.user_id,
    amount: expenseRow.amount,
    currency: expenseRow.currency || undefined,
    description: expenseRow.description,
    category: expenseRow.category,
    subcategory: expenseRow.subcategory || undefined,
    merchantName: expenseRow.merchant_name || undefined,
    paymentMethod: expenseRow.payment_method || undefined,
    receipt: expenseRow.receipt as Record<string, unknown> || undefined,
    notes: expenseRow.notes || undefined,
    tags: (expenseRow.tags as string[]) || [],
    isBusinessExpense: expenseRow.is_business_expense || false,
    isRecurring: expenseRow.is_recurring || false,
    createdAt: expenseRow.created_at || new Date().toISOString(),
    updatedAt: expenseRow.updated_at || new Date().toISOString(),
  };
}