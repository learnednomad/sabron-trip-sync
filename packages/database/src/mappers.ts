import type {
  UserWithProfile,
  ItineraryWithDetails,
  ActivityWithDetails,
  ExpenseWithSplits,
  UserRow,
  ItineraryRow,
  ActivityRow,
  ExpenseRow,
  AccommodationRow,
  TransportationRow,
  BudgetRow,
  CollaboratorRow,
  TravelerRow,
  UserProfileRow,
  UserPreferencesRow,
  UserSettingsRow,
} from './helpers';

// Import application types for mapping
import type {
  User,
  Itinerary,
  Activity,
  Transaction as Expense,
  Accommodation,
  Transportation,
  Budget,
  Collaborator,
  Traveler,
  UserProfile,
  UserPreferences,
  UserSettings,
} from '@sabron/types';

/**
 * Type mappers to convert between database types and application types
 * These provide a clean abstraction layer between the database schema and application logic
 */

// User type mappers
export function mapUserRowToUser(userRow: UserRow): User {
  return {
    id: userRow.id,
    email: userRow.email,
    username: userRow.username || undefined,
    name: userRow.name || '',
    avatar: userRow.avatar_url ? { id: userRow.id, url: userRow.avatar_url } : undefined,
    createdAt: userRow.created_at,
    updatedAt: userRow.updated_at,
    lastActiveAt: userRow.last_active_at || undefined,
    isVerified: userRow.is_verified || false,
    role: userRow.role as 'user' | 'admin' | 'moderator',
    status: userRow.status as 'active' | 'inactive' | 'suspended',
    timeZone: userRow.timezone || 'UTC',
  };
}

export function mapUserWithProfileToUser(userWithProfile: UserWithProfile): User & {
  profile?: UserProfile;
  preferences?: UserPreferences;
  settings?: UserSettings;
} {
  const baseUser = mapUserRowToUser(userWithProfile);
  
  return {
    ...baseUser,
    profile: userWithProfile.user_profiles ? mapUserProfileRowToUserProfile(userWithProfile.user_profiles) : undefined,
    preferences: userWithProfile.user_preferences ? mapUserPreferencesRowToUserPreferences(userWithProfile.user_preferences) : undefined,
    settings: userWithProfile.user_settings ? mapUserSettingsRowToUserSettings(userWithProfile.user_settings) : undefined,
  };
}

// User profile mappers
export function mapUserProfileRowToUserProfile(profileRow: UserProfileRow): UserProfile {
  return {
    userId: profileRow.user_id,
    firstName: profileRow.first_name || '',
    lastName: profileRow.last_name || '',
    dateOfBirth: profileRow.date_of_birth || undefined,
    gender: profileRow.gender || undefined,
    bio: profileRow.bio || undefined,
    location: profileRow.location || undefined,
    website: profileRow.website || undefined,
    socialLinks: (profileRow.social_links as Record<string, string>) || {},
    isPublic: profileRow.is_public || false,
    profileCompleteness: profileRow.profile_completeness || 0,
  };
}

// User preferences mappers
export function mapUserPreferencesRowToUserPreferences(preferencesRow: UserPreferencesRow): UserPreferences {
  return {
    userId: preferencesRow.user_id,
    language: preferencesRow.language || 'en',
    currency: preferencesRow.currency || 'USD',
    timeZone: preferencesRow.timezone || 'UTC',
    dateFormat: preferencesRow.date_format || 'MM/DD/YYYY',
    temperatureUnit: preferencesRow.temperature_unit as 'celsius' | 'fahrenheit' || 'celsius',
    distanceUnit: preferencesRow.distance_unit as 'metric' | 'imperial' || 'metric',
    notifications: (preferencesRow.notifications as Record<string, boolean>) || {},
    privacy: (preferencesRow.privacy as Record<string, boolean>) || {},
    accessibility: (preferencesRow.accessibility as Record<string, boolean>) || {},
    travelPreferences: (preferencesRow.travel_preferences as Record<string, unknown>) || {},
  };
}

// User settings mappers
export function mapUserSettingsRowToUserSettings(settingsRow: UserSettingsRow): UserSettings {
  return {
    userId: settingsRow.user_id,
    theme: settingsRow.theme as 'light' | 'dark' | 'system' || 'system',
    emailNotifications: settingsRow.email_notifications || true,
    pushNotifications: settingsRow.push_notifications || true,
    smsNotifications: settingsRow.sms_notifications || false,
    marketingEmails: settingsRow.marketing_emails || false,
    dataSharing: settingsRow.data_sharing || false,
    twoFactorEnabled: settingsRow.two_factor_enabled || false,
    sessionTimeout: settingsRow.session_timeout || 30,
    autoSave: settingsRow.auto_save || true,
    defaultVisibility: settingsRow.default_visibility as 'public' | 'private' | 'shared' || 'private',
  };
}

// Itinerary type mappers
export function mapItineraryRowToItinerary(itineraryRow: ItineraryRow): Itinerary {
  return {
    id: itineraryRow.id,
    userId: itineraryRow.user_id,
    title: itineraryRow.title,
    description: itineraryRow.description || undefined,
    coverImage: itineraryRow.cover_image_url ? {
      id: itineraryRow.id,
      url: itineraryRow.cover_image_url,
    } : undefined,
    destinations: (itineraryRow.destinations as any[]) || [],
    startDate: itineraryRow.start_date,
    endDate: itineraryRow.end_date,
    duration: Math.ceil((new Date(itineraryRow.end_date).getTime() - new Date(itineraryRow.start_date).getTime()) / (1000 * 60 * 60 * 24)),
    status: itineraryRow.status as 'draft' | 'planned' | 'active' | 'completed' | 'cancelled',
    visibility: itineraryRow.visibility as 'public' | 'private' | 'shared',
    tags: (itineraryRow.tags as string[]) || [],
    travelers: [],
    activities: [],
    collaborators: [],
    transportation: [],
    accommodations: [],
    notes: itineraryRow.notes || undefined,
    customFields: (itineraryRow.custom_fields as Record<string, unknown>) || {},
    isTemplate: itineraryRow.is_template || false,
    templateCategory: itineraryRow.template_category || undefined,
    version: itineraryRow.version || 1,
    createdAt: itineraryRow.created_at,
    updatedAt: itineraryRow.updated_at,
  };
}

export function mapItineraryWithDetailsToItinerary(itineraryWithDetails: ItineraryWithDetails): Itinerary {
  const baseItinerary = mapItineraryRowToItinerary(itineraryWithDetails);
  
  return {
    ...baseItinerary,
    activities: itineraryWithDetails.activities?.map(mapActivityRowToActivity) || [],
    accommodations: itineraryWithDetails.accommodations?.map(mapAccommodationRowToAccommodation) || [],
    transportation: itineraryWithDetails.transportation?.map(mapTransportationRowToTransportation) || [],
    travelers: itineraryWithDetails.travelers?.map(mapTravelerRowToTraveler) || [],
    collaborators: itineraryWithDetails.collaborators?.map(collab => mapCollaboratorRowToCollaborator(collab)) || [],
    budget: itineraryWithDetails.budgets ? mapBudgetRowToBudget(itineraryWithDetails.budgets) : undefined,
  };
}

// Activity type mappers
export function mapActivityRowToActivity(activityRow: ActivityRow): Activity {
  return {
    id: activityRow.id,
    itineraryId: activityRow.itinerary_id,
    title: activityRow.title,
    description: activityRow.description || undefined,
    category: activityRow.category || 'other',
    startTime: activityRow.start_time,
    endTime: activityRow.end_time || activityRow.start_time,
    duration: activityRow.duration || 60,
    location: activityRow.location || undefined,
    coordinates: activityRow.latitude && activityRow.longitude ? {
      latitude: activityRow.latitude,
      longitude: activityRow.longitude,
    } : undefined,
    cost: activityRow.cost ? {
      amount: activityRow.cost,
      currency: activityRow.currency || 'USD',
    } : undefined,
    bookingUrl: activityRow.booking_url || undefined,
    bookingReference: activityRow.booking_reference || undefined,
    notes: activityRow.notes || undefined,
    tags: (activityRow.tags as string[]) || [],
    isBookmarked: activityRow.is_bookmarked || false,
    isCompleted: activityRow.is_completed || false,
    reminder: activityRow.reminder_time || undefined,
    createdAt: activityRow.created_at,
    updatedAt: activityRow.updated_at,
  };
}

// Expense type mappers
export function mapExpenseRowToExpense(expenseRow: ExpenseRow): Expense {
  return {
    id: expenseRow.id,
    itineraryId: expenseRow.itinerary_id || undefined,
    activityId: expenseRow.activity_id || undefined,
    userId: expenseRow.user_id,
    amount: {
      amount: expenseRow.amount,
      currency: expenseRow.currency,
    },
    description: expenseRow.description,
    category: expenseRow.category || 'other',
    subcategory: expenseRow.subcategory || undefined,
    date: expenseRow.date,
    vendor: expenseRow.vendor || undefined,
    paymentMethod: expenseRow.payment_method || undefined,
    receipt: expenseRow.receipt_url ? {
      id: expenseRow.id,
      url: expenseRow.receipt_url,
    } : undefined,
    notes: expenseRow.notes || undefined,
    tags: (expenseRow.tags as string[]) || [],
    isReimbursable: expenseRow.is_reimbursable || false,
    isReimbursed: expenseRow.is_reimbursed || false,
    createdAt: expenseRow.created_at,
    updatedAt: expenseRow.updated_at,
  };
}

// Accommodation type mappers
export function mapAccommodationRowToAccommodation(accommodationRow: AccommodationRow): Accommodation {
  return {
    id: accommodationRow.id,
    name: accommodationRow.name,
    type: accommodationRow.type as any,
    address: accommodationRow.address,
    checkIn: accommodationRow.check_in,
    checkOut: accommodationRow.check_out,
    confirmationNumber: accommodationRow.confirmation_number || undefined,
    cost: accommodationRow.cost ? {
      amount: accommodationRow.cost,
      currency: accommodationRow.currency || 'USD',
    } : undefined,
    amenities: (accommodationRow.amenities as string[]) || [],
    notes: accommodationRow.notes || undefined,
    contact: accommodationRow.contact_info ? accommodationRow.contact_info as any : undefined,
    documents: [],
  };
}

// Transportation type mappers
export function mapTransportationRowToTransportation(transportationRow: TransportationRow): Transportation {
  return {
    id: transportationRow.id,
    type: transportationRow.type as any,
    from: transportationRow.from_location,
    to: transportationRow.to_location,
    departure: transportationRow.departure_time,
    arrival: transportationRow.arrival_time,
    carrier: transportationRow.carrier || undefined,
    bookingReference: transportationRow.booking_reference || undefined,
    cost: transportationRow.cost ? {
      amount: transportationRow.cost,
      currency: transportationRow.currency || 'USD',
    } : undefined,
    notes: transportationRow.notes || undefined,
    documents: [],
  };
}

// Budget type mappers
export function mapBudgetRowToBudget(budgetRow: BudgetRow): Budget {
  return {
    total: {
      amount: budgetRow.total_amount,
      currency: budgetRow.currency,
    },
    spent: budgetRow.spent_amount ? {
      amount: budgetRow.spent_amount,
      currency: budgetRow.currency,
    } : undefined,
    categories: (budgetRow.categories as any[]) || [],
    currency: budgetRow.currency,
    exchangeRates: (budgetRow.exchange_rates as Record<string, number>) || {},
  };
}

// Collaborator type mappers
export function mapCollaboratorRowToCollaborator(collaboratorRow: CollaboratorRow & { users?: UserRow }): Collaborator {
  return {
    userId: collaboratorRow.user_id,
    user: collaboratorRow.users ? mapUserRowToUser(collaboratorRow.users) : undefined,
    role: collaboratorRow.role as any,
    permissions: (collaboratorRow.permissions as string[]) || [],
    invitedBy: collaboratorRow.invited_by,
    joinedAt: collaboratorRow.joined_at || collaboratorRow.created_at,
    lastActiveAt: collaboratorRow.last_active_at || undefined,
  };
}

// Traveler type mappers
export function mapTravelerRowToTraveler(travelerRow: TravelerRow): Traveler {
  return {
    userId: travelerRow.user_id || undefined,
    name: travelerRow.name,
    email: travelerRow.email || undefined,
    role: travelerRow.role as any,
    status: travelerRow.status as any,
    joinedAt: travelerRow.joined_at || travelerRow.created_at,
    preferences: travelerRow.preferences ? travelerRow.preferences as any : undefined,
  };
}

// Reverse mappers (Application types to Database types)
export function mapUserToUserInsert(user: Partial<User>): Partial<UserRow> {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    avatar_url: user.avatar?.url,
    is_verified: user.isVerified,
    role: user.role,
    status: user.status,
    timezone: user.timeZone,
  };
}

export function mapItineraryToItineraryInsert(itinerary: Partial<Itinerary>): Partial<ItineraryRow> {
  return {
    id: itinerary.id,
    user_id: itinerary.userId,
    title: itinerary.title,
    description: itinerary.description,
    cover_image_url: itinerary.coverImage?.url,
    destinations: itinerary.destinations as any,
    start_date: itinerary.startDate,
    end_date: itinerary.endDate,
    status: itinerary.status,
    visibility: itinerary.visibility,
    tags: itinerary.tags,
    notes: itinerary.notes,
    custom_fields: itinerary.customFields,
    is_template: itinerary.isTemplate,
    template_category: itinerary.templateCategory,
    version: itinerary.version,
  };
}

export function mapActivityToActivityInsert(activity: Partial<Activity>): Partial<ActivityRow> {
  return {
    id: activity.id,
    itinerary_id: activity.itineraryId,
    title: activity.title,
    description: activity.description,
    category: activity.category,
    start_time: activity.startTime,
    end_time: activity.endTime,
    duration: activity.duration,
    location: activity.location,
    latitude: activity.coordinates?.latitude,
    longitude: activity.coordinates?.longitude,
    cost: activity.cost?.amount,
    currency: activity.cost?.currency,
    booking_url: activity.bookingUrl,
    booking_reference: activity.bookingReference,
    notes: activity.notes,
    tags: activity.tags,
    is_bookmarked: activity.isBookmarked,
    is_completed: activity.isCompleted,
    reminder_time: activity.reminder,
  };
}

export function mapExpenseToExpenseInsert(expense: Partial<Expense>): Partial<ExpenseRow> {
  return {
    id: expense.id,
    itinerary_id: expense.itineraryId,
    activity_id: expense.activityId,
    user_id: expense.userId,
    amount: expense.amount?.amount,
    currency: expense.amount?.currency || 'USD',
    description: expense.description,
    category: expense.category,
    subcategory: expense.subcategory,
    date: expense.date,
    vendor: expense.vendor,
    payment_method: expense.paymentMethod,
    receipt_url: expense.receipt?.url,
    notes: expense.notes,
    tags: expense.tags,
    is_reimbursable: expense.isReimbursable,
    is_reimbursed: expense.isReimbursed,
  };
}