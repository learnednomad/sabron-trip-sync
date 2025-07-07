import type {
  BaseEntity,
  ID,
  Money,
  Image,
  Timestamp
} from './common';
import type { User } from './user';
import type { Location, WeatherInfo } from './location';

export interface Activity extends BaseEntity {
  itineraryId: ID;
  title: string;
  description?: string;
  location: Location;
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number; // minutes
  category: ActivityCategory;
  subcategory?: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  bookingInfo?: BookingInfo;
  cost?: Money;
  participants: Participant[];
  notes?: string;
  tags: string[];
  images: Image[];
  attachments: Attachment[];
  weather?: WeatherInfo;
  transportation?: ActivityTransportation;
  accessibility?: AccessibilityInfo;
  reminders: Reminder[];
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  createdBy: ID;
  lastModifiedBy?: ID;
  customFields?: Record<string, unknown>;
  linkedActivities?: ID[];
  source?: ActivitySource;
}

export type ActivityCategory =
  | 'dining'
  | 'attraction'
  | 'transport'
  | 'accommodation'
  | 'shopping'
  | 'entertainment'
  | 'outdoor'
  | 'cultural'
  | 'relaxation'
  | 'nightlife'
  | 'sports'
  | 'business'
  | 'other';

export type ActivityStatus =
  | 'planned'
  | 'confirmed'
  | 'tentative'
  | 'cancelled'
  | 'completed';

export type ActivityPriority = 'must-do' | 'should-do' | 'nice-to-do' | 'optional';

export interface BookingInfo {
  status: BookingStatus;
  provider?: string;
  confirmationNumber?: string;
  bookingUrl?: string;
  bookingDate?: Timestamp;
  cancellationPolicy?: string;
  cancellationDeadline?: Timestamp;
  isPaid: boolean;
  paymentMethod?: string;
  specialRequests?: string;
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export type BookingStatus =
  | 'not-required'
  | 'pending'
  | 'confirmed'
  | 'waitlisted'
  | 'cancelled'
  | 'completed';

export interface Participant {
  userId: ID;
  user?: User;
  status: ParticipantStatus;
  role?: string;
  notes?: string;
  rsvpDate?: Timestamp;
}

export type ParticipantStatus = 'attending' | 'not-attending' | 'maybe' | 'pending';

export interface Attachment {
  id: ID;
  type: AttachmentType;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: ID;
  uploadedAt: Timestamp;
}

export type AttachmentType =
  | 'document'
  | 'ticket'
  | 'receipt'
  | 'map'
  | 'menu'
  | 'other';



export interface ActivityTransportation {
  mode: TransportMode;
  duration: number; // minutes
  distance: number; // km
  cost?: Money;
  departureLocation?: Location;
  route?: string;
  provider?: string;
  bookingRequired: boolean;
  notes?: string;
}

export type TransportMode =
  | 'walk'
  | 'car'
  | 'taxi'
  | 'public-transport'
  | 'bike'
  | 'boat'
  | 'other';

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  assistanceAvailable: boolean;
  audioGuide: boolean;
  visualAids: boolean;
  signLanguageSupport: boolean;
  brailleAvailable: boolean;
  serviceAnimalsAllowed: boolean;
  notes?: string;
}

export interface Reminder {
  id: ID;
  type: ReminderType;
  time: Timestamp;
  message: string;
  recipients: ID[];
  sent: boolean;
  sentAt?: Timestamp;
}

export type ReminderType = 'email' | 'push' | 'sms' | 'in-app';

export interface RecurringPattern {
  frequency: RecurringFrequency;
  interval: number;
  daysOfWeek?: number[]; // 0-6, Sunday-Saturday
  dayOfMonth?: number;
  endDate?: Timestamp;
  occurrences?: number;
  exceptions?: Timestamp[];
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ActivitySource {
  type: 'manual' | 'imported' | 'suggested' | 'template';
  reference?: string;
  importedFrom?: string;
  importedAt?: Timestamp;
}

export interface ActivitySuggestion {
  activity: Partial<Activity>;
  reason: string;
  score: number;
  source: SuggestionSource;
  basedOn?: {
    userPreferences?: boolean;
    popularWithSimilarUsers?: boolean;
    weatherOptimized?: boolean;
    locationProximity?: boolean;
    timeOptimized?: boolean;
  };
}

export type SuggestionSource = 'ai' | 'popular' | 'sponsored' | 'editorial' | 'user';

export interface ActivityReview {
  id: ID;
  activityId: ID;
  userId: ID;
  user?: User;
  rating: number; // 1-5
  title?: string;
  content: string;
  pros?: string[];
  cons?: string[];
  visitedAt: Timestamp;
  images?: Image[];
  helpful: number;
  verified: boolean;
  response?: {
    content: string;
    respondedBy: ID;
    respondedAt: Timestamp;
  };
}
