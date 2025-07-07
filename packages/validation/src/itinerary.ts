import { z } from 'zod';
import {
  IdSchema,
  TimestampSchema,
  DateRangeSchema,
  MoneySchema,
  ImageSchema,
} from './common';
import { sanitizeHtml } from './utils';

// Itinerary status
export const ItineraryStatusSchema = z.enum([
  'draft',
  'planned',
  'active',
  'completed',
  'cancelled',
]);

// Visibility
export const VisibilitySchema = z.enum(['private', 'shared', 'public']);

// Budget category type
export const BudgetCategoryTypeSchema = z.enum([
  'accommodation',
  'transportation',
  'food',
  'activities',
  'shopping',
  'entertainment',
  'insurance',
  'visas',
  'other',
]);

// Traveler role and status
export const TravelerRoleSchema = z.enum(['organizer', 'co-organizer', 'participant', 'viewer']);
export const TravelerStatusSchema = z.enum(['confirmed', 'invited', 'declined', 'tentative']);

// Collaborator role and permissions
export const CollaboratorRoleSchema = z.enum(['owner', 'editor', 'commenter', 'viewer']);
export const CollaboratorPermissionSchema = z.enum([
  'edit_itinerary',
  'add_activities',
  'manage_budget',
  'invite_collaborators',
  'delete_itinerary',
  'manage_travelers',
]);

// Transportation type
export const TransportationTypeSchema = z.enum([
  'flight',
  'train',
  'bus',
  'car',
  'ferry',
  'cruise',
  'other',
]);

// Accommodation type
export const AccommodationTypeSchema = z.enum([
  'hotel',
  'hostel',
  'airbnb',
  'resort',
  'camping',
  'apartment',
  'other',
]);

// Destination schema
export const DestinationSchema = z.object({
  id: IdSchema.optional(),
  name: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  region: z.string().max(100).optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  timezone: z.string(),
  description: z.string().max(1000).transform(sanitizeHtml).optional(),
  imageUrl: z.string().url().optional(),
});

// Budget category schema
export const BudgetCategorySchema = z.object({
  name: z.string().min(1).max(50),
  type: BudgetCategoryTypeSchema,
  allocated: MoneySchema,
  spent: MoneySchema.optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().max(50).optional(),
});

// Budget schema
export const BudgetSchema = z.object({
  total: MoneySchema,
  spent: MoneySchema.optional(),
  categories: z.array(BudgetCategorySchema).default([]),
  currency: z.string().length(3),
  exchangeRates: z.record(z.string(), z.number()).optional(),
});

// Traveler preferences
export const TravelerPreferencesSchema = z.object({
  roomSharing: z.boolean().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  accessibilityNeeds: z.array(z.string()).optional(),
  emergencyContact: z
    .object({
      name: z.string().min(1).max(100),
      phone: z.string().min(1).max(50),
      relationship: z.string().min(1).max(50),
    })
    .optional(),
});

// Traveler schema
export const TravelerSchema = z.object({
  userId: IdSchema.optional(),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  role: TravelerRoleSchema,
  status: TravelerStatusSchema.default('invited'),
  joinedAt: TimestampSchema.optional(),
  preferences: TravelerPreferencesSchema.optional(),
});

// Collaborator schema
export const CollaboratorSchema = z.object({
  userId: IdSchema,
  role: CollaboratorRoleSchema,
  permissions: z.array(CollaboratorPermissionSchema).default([]),
  invitedBy: IdSchema,
  joinedAt: TimestampSchema.optional(),
  lastActiveAt: TimestampSchema.optional(),
});

// Transportation schema
export const TransportationSchema = z.object({
  id: IdSchema.optional(),
  type: TransportationTypeSchema,
  from: z.string().min(1).max(200),
  to: z.string().min(1).max(200),
  departure: TimestampSchema,
  arrival: TimestampSchema,
  carrier: z.string().max(100).optional(),
  bookingReference: z.string().max(100).optional(),
  cost: MoneySchema.optional(),
  notes: z.string().max(1000).transform(sanitizeHtml).optional(),
});

// Accommodation schema
export const AccommodationSchema = z.object({
  id: IdSchema.optional(),
  name: z.string().min(1).max(200),
  type: AccommodationTypeSchema,
  address: z.string().min(1).max(500),
  checkIn: TimestampSchema,
  checkOut: TimestampSchema,
  confirmationNumber: z.string().max(100).optional(),
  cost: MoneySchema.optional(),
  amenities: z.array(z.string().max(50)).optional(),
  notes: z.string().max(1000).transform(sanitizeHtml).optional(),
  contact: z
    .object({
      phone: z.string().max(50).optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
});

// Sharing settings schema
export const SharingSettingsSchema = z.object({
  isPublic: z.boolean().default(false),
  shareableLink: z.string().url().optional(),
  password: z.string().min(6).max(100).optional(),
  expiresAt: TimestampSchema.optional(),
  allowComments: z.boolean().default(true),
  allowCopying: z.boolean().default(false),
  showBudget: z.boolean().default(false),
  showTravelers: z.boolean().default(true),
});

// Create itinerary schema
export const CreateItinerarySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).transform(sanitizeHtml).optional(),
  coverImage: ImageSchema.optional(),
  destinations: z.array(DestinationSchema).min(1),
  dateRange: DateRangeSchema,
  status: ItineraryStatusSchema.default('draft'),
  visibility: VisibilitySchema.default('private'),
  tags: z.array(z.string().max(50)).max(10).default([]),
  budget: BudgetSchema.optional(),
  travelers: z.array(TravelerSchema).default([]),
  transportation: z.array(TransportationSchema).default([]),
  accommodations: z.array(AccommodationSchema).default([]),
  notes: z.string().max(5000).transform(sanitizeHtml).optional(),
  isTemplate: z.boolean().default(false),
  templateCategory: z.string().max(50).optional(),
  sharing: SharingSettingsSchema.optional(),
});

// Update itinerary schema
export const UpdateItinerarySchema = CreateItinerarySchema.partial();

// Search itineraries schema
export const SearchItinerariesSchema = z.object({
  query: z.string().max(200).optional(),
  filters: z
    .object({
      status: z.array(ItineraryStatusSchema).optional(),
      visibility: z.array(VisibilitySchema).optional(),
      destinations: z.array(z.string()).optional(),
      dateRange: DateRangeSchema.optional(),
      tags: z.array(z.string()).optional(),
      budgetRange: z
        .object({
          min: z.number().nonnegative(),
          max: z.number().positive(),
          currency: z.string().length(3),
        })
        .optional(),
      duration: z
        .object({
          min: z.number().positive(),
          max: z.number().positive(),
        })
        .optional(),
      isTemplate: z.boolean().optional(),
      userId: IdSchema.optional(),
    })
    .optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'startDate', 'title', 'popularity'])
    .default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Invite collaborator schema
export const InviteCollaboratorSchema = z.object({
  email: z.string().email(),
  role: CollaboratorRoleSchema.default('viewer'),
  permissions: z.array(CollaboratorPermissionSchema).optional(),
  message: z.string().max(500).optional(),
});

// Update collaborator schema
export const UpdateCollaboratorSchema = z.object({
  role: CollaboratorRoleSchema.optional(),
  permissions: z.array(CollaboratorPermissionSchema).optional(),
});

// Add traveler schema
export const AddTravelerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  role: TravelerRoleSchema.default('participant'),
  preferences: TravelerPreferencesSchema.optional(),
  sendInvite: z.boolean().default(true),
});

// Update traveler schema
export const UpdateTravelerSchema = z.object({
  role: TravelerRoleSchema.optional(),
  status: TravelerStatusSchema.optional(),
  preferences: TravelerPreferencesSchema.optional(),
});

// Share itinerary schema
export const ShareItinerarySchema = z.object({
  visibility: VisibilitySchema,
  settings: SharingSettingsSchema.optional(),
  recipients: z
    .array(
      z.object({
        email: z.string().email(),
        message: z.string().max(500).optional(),
      })
    )
    .optional(),
});

// Clone itinerary schema
export const CloneItinerarySchema = z.object({
  title: z.string().min(1).max(200),
  includeBudget: z.boolean().default(false),
  includeActivities: z.boolean().default(true),
  includeTravelers: z.boolean().default(false),
  includeAccommodations: z.boolean().default(true),
  includeTransportation: z.boolean().default(true),
  adjustDates: z.boolean().default(true),
  newStartDate: TimestampSchema.optional(),
});

// Export types
export type ItineraryStatus = z.infer<typeof ItineraryStatusSchema>;
export type Visibility = z.infer<typeof VisibilitySchema>;
export type BudgetCategoryType = z.infer<typeof BudgetCategoryTypeSchema>;
export type TravelerRole = z.infer<typeof TravelerRoleSchema>;
export type TravelerStatus = z.infer<typeof TravelerStatusSchema>;
export type CollaboratorRole = z.infer<typeof CollaboratorRoleSchema>;
export type CollaboratorPermission = z.infer<typeof CollaboratorPermissionSchema>;
export type TransportationType = z.infer<typeof TransportationTypeSchema>;
export type AccommodationType = z.infer<typeof AccommodationTypeSchema>;
export type Destination = z.infer<typeof DestinationSchema>;
export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;
export type Budget = z.infer<typeof BudgetSchema>;
export type TravelerPreferences = z.infer<typeof TravelerPreferencesSchema>;
export type Traveler = z.infer<typeof TravelerSchema>;
export type Collaborator = z.infer<typeof CollaboratorSchema>;
export type Transportation = z.infer<typeof TransportationSchema>;
export type Accommodation = z.infer<typeof AccommodationSchema>;
export type SharingSettings = z.infer<typeof SharingSettingsSchema>;
export type CreateItinerary = z.infer<typeof CreateItinerarySchema>;
export type UpdateItinerary = z.infer<typeof UpdateItinerarySchema>;
export type SearchItineraries = z.infer<typeof SearchItinerariesSchema>;
export type InviteCollaborator = z.infer<typeof InviteCollaboratorSchema>;
export type UpdateCollaborator = z.infer<typeof UpdateCollaboratorSchema>;
export type AddTraveler = z.infer<typeof AddTravelerSchema>;
export type UpdateTraveler = z.infer<typeof UpdateTravelerSchema>;
export type ShareItinerary = z.infer<typeof ShareItinerarySchema>;
export type CloneItinerary = z.infer<typeof CloneItinerarySchema>;
