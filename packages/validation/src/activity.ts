import { z } from 'zod';

import { BookingStatusSchema } from './booking';
import {
  IdSchema,
  TimestampSchema,
  MoneySchema,
  ImageSchema,
  FileSchema,
  CoordinatesSchema,
} from './common';
import { sanitizeHtml } from './utils';

// Activity category
export const ActivityCategorySchema = z.enum([
  'dining',
  'attraction',
  'transport',
  'accommodation',
  'shopping',
  'entertainment',
  'outdoor',
  'cultural',
  'relaxation',
  'nightlife',
  'sports',
  'business',
  'other',
]);

// Activity status
export const ActivityStatusSchema = z.enum([
  'planned',
  'confirmed',
  'tentative',
  'cancelled',
  'completed',
]);

// Activity priority
export const ActivityPrioritySchema = z.enum(['must-do', 'should-do', 'nice-to-do', 'optional']);



// Participant status
export const ParticipantStatusSchema = z.enum(['attending', 'not-attending', 'maybe', 'pending']);

// Attachment type
export const AttachmentTypeSchema = z.enum([
  'document',
  'ticket',
  'receipt',
  'map',
  'menu',
  'other',
]);

// Weather condition
export const WeatherConditionSchema = z.enum([
  'sunny',
  'partly-cloudy',
  'cloudy',
  'rainy',
  'stormy',
  'snowy',
  'windy',
  'foggy',
]);

// Transport mode
export const TransportModeSchema = z.enum([
  'walk',
  'car',
  'taxi',
  'public-transport',
  'bike',
  'boat',
  'other',
]);

// Reminder type
export const ReminderTypeSchema = z.enum(['email', 'push', 'sms', 'in-app']);

// Recurring frequency
export const RecurringFrequencySchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);

// Location schema
export const LocationSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().max(500).optional(),
  coordinates: CoordinatesSchema,
  placeId: z.string().max(100).optional(),
  phoneNumber: z.string().max(50).optional(),
  website: z.string().url().optional(),
  rating: z.number().min(0).max(5).optional(),
  priceLevel: z.number().min(1).max(4).optional(),
});

// Booking info schema
export const BookingInfoSchema = z.object({
  status: BookingStatusSchema,
  provider: z.string().max(100).optional(),
  confirmationNumber: z.string().max(100).optional(),
  bookingUrl: z.string().url().optional(),
  bookingDate: TimestampSchema.optional(),
  cancellationPolicy: z.string().max(1000).optional(),
  cancellationDeadline: TimestampSchema.optional(),
  isPaid: z.boolean().default(false),
  paymentMethod: z.string().max(50).optional(),
  specialRequests: z.string().max(500).optional(),
  contactInfo: z
    .object({
      name: z.string().max(100).optional(),
      phone: z.string().max(50).optional(),
      email: z.string().email().optional(),
    })
    .optional(),
});

// Participant schema
export const ParticipantSchema = z.object({
  userId: IdSchema,
  status: ParticipantStatusSchema.default('pending'),
  role: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
  rsvpDate: TimestampSchema.optional(),
});

// Attachment schema
export const AttachmentSchema = FileSchema.extend({
  type: AttachmentTypeSchema,
  uploadedBy: IdSchema,
  uploadedAt: TimestampSchema,
});

// Weather info schema
export const WeatherInfoSchema = z.object({
  temperature: z.object({
    min: z.number(),
    max: z.number(),
    unit: z.enum(['celsius', 'fahrenheit']),
  }),
  condition: WeatherConditionSchema,
  precipitation: z.number().min(0).max(100),
  humidity: z.number().min(0).max(100),
  windSpeed: z.number().nonnegative(),
  uvIndex: z.number().min(0).max(11).optional(),
  sunrise: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  sunset: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
});

// Activity transportation schema
export const ActivityTransportationSchema = z.object({
  mode: TransportModeSchema,
  duration: z.number().positive(),
  distance: z.number().nonnegative(),
  cost: MoneySchema.optional(),
  departureLocation: LocationSchema.optional(),
  route: z.string().max(500).optional(),
  provider: z.string().max(100).optional(),
  bookingRequired: z.boolean().default(false),
  notes: z.string().max(500).optional(),
});

// Accessibility info schema
export const AccessibilityInfoSchema = z.object({
  wheelchairAccessible: z.boolean().default(false),
  assistanceAvailable: z.boolean().default(false),
  audioGuide: z.boolean().default(false),
  visualAids: z.boolean().default(false),
  signLanguageSupport: z.boolean().default(false),
  brailleAvailable: z.boolean().default(false),
  serviceAnimalsAllowed: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});

// Reminder schema
export const ReminderSchema = z.object({
  id: IdSchema.optional(),
  type: ReminderTypeSchema,
  time: TimestampSchema,
  message: z.string().max(500),
  recipients: z.array(IdSchema).min(1),
  sent: z.boolean().default(false),
  sentAt: TimestampSchema.optional(),
});

// Recurring pattern schema
export const RecurringPatternSchema = z.object({
  frequency: RecurringFrequencySchema,
  interval: z.number().positive().default(1),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  endDate: TimestampSchema.optional(),
  occurrences: z.number().positive().optional(),
  exceptions: z.array(TimestampSchema).optional(),
});

// Base activity schema without refinements
const BaseActivitySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).transform(sanitizeHtml).optional(),
  location: LocationSchema,
  startTime: TimestampSchema,
  endTime: TimestampSchema,
  category: ActivityCategorySchema,
  subcategory: z.string().max(50).optional(),
  status: ActivityStatusSchema.default('planned'),
  priority: ActivityPrioritySchema.default('nice-to-do'),
  bookingInfo: BookingInfoSchema.optional(),
  cost: MoneySchema.optional(),
  participants: z.array(ParticipantSchema).default([]),
  notes: z.string().max(2000).transform(sanitizeHtml).optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),
  images: z.array(ImageSchema).max(10).default([]),
  attachments: z.array(AttachmentSchema).max(10).default([]),
  weather: WeatherInfoSchema.optional(),
  transportation: ActivityTransportationSchema.optional(),
  accessibility: AccessibilityInfoSchema.optional(),
  reminders: z.array(ReminderSchema).max(5).default([]),
  isRecurring: z.boolean().default(false),
  recurringPattern: RecurringPatternSchema.optional(),
  linkedActivities: z.array(IdSchema).optional(),
  customFields: z.record(z.unknown()).optional(),
});

// Create activity schema with refinements
export const CreateActivitySchema = BaseActivitySchema.refine(
  (data) => new Date(data.startTime) <= new Date(data.endTime),
  { message: 'Start time must be before end time', path: ['endTime'] }
);

// Update activity schema
export const UpdateActivitySchema = BaseActivitySchema.partial();

// Search activities schema
export const SearchActivitiesSchema = z.object({
  query: z.string().max(200).optional(),
  itineraryId: IdSchema.optional(),
  filters: z
    .object({
      categories: z.array(ActivityCategorySchema).optional(),
      status: z.array(ActivityStatusSchema).optional(),
      priority: z.array(ActivityPrioritySchema).optional(),
      dateRange: z
        .object({
          start: TimestampSchema,
          end: TimestampSchema,
        })
        .optional(),
      location: z
        .object({
          coordinates: CoordinatesSchema,
          radius: z.number().positive(), // km
        })
        .optional(),
      priceRange: z
        .object({
          min: z.number().nonnegative(),
          max: z.number().positive(),
          currency: z.string().length(3),
        })
        .optional(),
      tags: z.array(z.string()).optional(),
      hasBooking: z.boolean().optional(),
      accessibility: z
        .object({
          wheelchairAccessible: z.boolean().optional(),
          audioGuide: z.boolean().optional(),
          signLanguageSupport: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
  sortBy: z
    .enum(['startTime', 'createdAt', 'title', 'priority', 'cost'])
    .default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Bulk update activities schema
export const BulkUpdateActivitiesSchema = z.object({
  activityIds: z.array(IdSchema).min(1).max(100),
  updates: UpdateActivitySchema,
});

// Reorder activities schema
export const ReorderActivitiesSchema = z.object({
  itineraryId: IdSchema,
  activityOrders: z.array(
    z.object({
      activityId: IdSchema,
      day: z.number().positive(),
      order: z.number().nonnegative(),
    })
  ),
});

// Add participant schema
export const AddParticipantSchema = z.object({
  userId: IdSchema,
  role: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
});

// Update participant schema
export const UpdateParticipantSchema = z.object({
  status: ParticipantStatusSchema.optional(),
  role: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
});

// Add reminder schema
export const AddReminderSchema = z.object({
  type: ReminderTypeSchema,
  time: TimestampSchema,
  message: z.string().max(500),
  recipients: z.array(IdSchema).min(1).optional(),
});

// Upload attachment schema
export const UploadAttachmentSchema = z.object({
  file: FileSchema,
  type: AttachmentTypeSchema,
});

// Activity suggestion schema
export const ActivitySuggestionSchema = z.object({
  itineraryId: IdSchema,
  location: CoordinatesSchema.optional(),
  categories: z.array(ActivityCategorySchema).optional(),
  budget: z
    .object({
      min: z.number().nonnegative(),
      max: z.number().positive(),
      currency: z.string().length(3),
    })
    .optional(),
  preferences: z
    .object({
      interests: z.array(z.string()).optional(),
      accessibility: z.array(z.string()).optional(),
      dietary: z.array(z.string()).optional(),
    })
    .optional(),
  timeSlots: z
    .array(
      z.object({
        start: TimestampSchema,
        end: TimestampSchema,
      })
    )
    .optional(),
  limit: z.number().min(1).max(50).default(10),
});

// Export types
export type ActivityCategory = z.infer<typeof ActivityCategorySchema>;
export type ActivityStatus = z.infer<typeof ActivityStatusSchema>;
export type ActivityPriority = z.infer<typeof ActivityPrioritySchema>;
export type ParticipantStatus = z.infer<typeof ParticipantStatusSchema>;
export type AttachmentType = z.infer<typeof AttachmentTypeSchema>;
export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
export type TransportMode = z.infer<typeof TransportModeSchema>;
export type ReminderType = z.infer<typeof ReminderTypeSchema>;
export type RecurringFrequency = z.infer<typeof RecurringFrequencySchema>;
export type Location = z.infer<typeof LocationSchema>;
export type BookingInfo = z.infer<typeof BookingInfoSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type Attachment = z.infer<typeof AttachmentSchema>;
export type WeatherInfo = z.infer<typeof WeatherInfoSchema>;
export type ActivityTransportation = z.infer<typeof ActivityTransportationSchema>;
export type AccessibilityInfo = z.infer<typeof AccessibilityInfoSchema>;
export type Reminder = z.infer<typeof ReminderSchema>;
export type RecurringPattern = z.infer<typeof RecurringPatternSchema>;
export type CreateActivity = z.infer<typeof CreateActivitySchema>;
export type UpdateActivity = z.infer<typeof UpdateActivitySchema>;
export type SearchActivities = z.infer<typeof SearchActivitiesSchema>;
export type BulkUpdateActivities = z.infer<typeof BulkUpdateActivitiesSchema>;
export type ReorderActivities = z.infer<typeof ReorderActivitiesSchema>;
export type AddParticipant = z.infer<typeof AddParticipantSchema>;
export type UpdateParticipant = z.infer<typeof UpdateParticipantSchema>;
export type AddReminder = z.infer<typeof AddReminderSchema>;
export type UploadAttachment = z.infer<typeof UploadAttachmentSchema>;
export type ActivitySuggestion = z.infer<typeof ActivitySuggestionSchema>;
