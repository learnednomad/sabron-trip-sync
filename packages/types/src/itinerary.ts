import type { Activity } from './activity';
import type {
  BaseEntity,
  ID,
  Money,
  Image,
  Visibility,
  Timestamp
} from './common';
import type { Destination } from './location';
import type { User } from './user';

export interface Itinerary extends BaseEntity {
  userId: ID;
  title: string;
  description?: string;
  coverImage?: Image;
  destinations: Destination[];
  startDate: Timestamp;
  endDate: Timestamp;
  duration: number; // days
  status: ItineraryStatus;
  visibility: Visibility;
  tags: string[];
  budget?: Budget;
  travelers: Traveler[];
  activities: Activity[];
  collaborators: Collaborator[];
  transportation: Transportation[];
  accommodations: Accommodation[];
  notes?: string;
  customFields?: Record<string, unknown>;
  stats?: ItineraryStats;
  sharing?: SharingSettings;
  isTemplate: boolean;
  templateCategory?: string;
  version: number;
}

export type ItineraryStatus = 'draft' | 'planned' | 'active' | 'completed' | 'cancelled';

export interface Budget {
  total: Money;
  spent?: Money;
  categories: BudgetCategory[];
  currency: string;
  exchangeRates?: Record<string, number>;
}

export interface BudgetCategory {
  name: string;
  type: BudgetCategoryType;
  allocated: Money;
  spent?: Money;
  color?: string;
  icon?: string;
}

export type BudgetCategoryType =
  | 'accommodation'
  | 'transportation'
  | 'food'
  | 'activities'
  | 'shopping'
  | 'entertainment'
  | 'insurance'
  | 'visas'
  | 'other';

export interface Transaction {
  id: ID;
  amount: Money;
  description: string;
  category: string;
  date: Timestamp;
  vendor?: string;
  paymentMethod?: string;
  receipt?: Image;
  notes?: string;
  isReimbursable?: boolean;
  tags?: string[];
}

export interface Traveler {
  userId?: ID;
  name: string;
  email?: string;
  role: TravelerRole;
  status: TravelerStatus;
  joinedAt: Timestamp;
  preferences?: TravelerPreferences;
}

export type TravelerRole = 'organizer' | 'co-organizer' | 'participant' | 'viewer';
export type TravelerStatus = 'confirmed' | 'invited' | 'declined' | 'tentative';

export interface TravelerPreferences {
  roomSharing?: boolean;
  dietaryRestrictions?: string[];
  accessibilityNeeds?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Collaborator {
  userId: ID;
  user?: User;
  role: CollaboratorRole;
  permissions: CollaboratorPermission[];
  invitedBy: ID;
  joinedAt: Timestamp;
  lastActiveAt?: Timestamp;
}

export type CollaboratorRole = 'owner' | 'editor' | 'commenter' | 'viewer';
export type CollaboratorPermission =
  | 'edit_itinerary'
  | 'add_activities'
  | 'manage_budget'
  | 'invite_collaborators'
  | 'delete_itinerary'
  | 'manage_travelers';

export interface Transportation {
  id: ID;
  type: TransportationType;
  from: string;
  to: string;
  departure: Timestamp;
  arrival: Timestamp;
  carrier?: string;
  bookingReference?: string;
  cost?: Money;
  notes?: string;
  documents?: Document[];
}

export type TransportationType =
  | 'flight'
  | 'train'
  | 'bus'
  | 'car'
  | 'ferry'
  | 'cruise'
  | 'other';

export interface Accommodation {
  id: ID;
  name: string;
  type: AccommodationType;
  address: string;
  checkIn: Timestamp;
  checkOut: Timestamp;
  confirmationNumber?: string;
  cost?: Money;
  amenities?: string[];
  notes?: string;
  documents?: Document[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export type AccommodationType =
  | 'hotel'
  | 'hostel'
  | 'airbnb'
  | 'resort'
  | 'camping'
  | 'apartment'
  | 'other';

export interface Document {
  id: ID;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: Timestamp;
  size: number;
}

export type DocumentType =
  | 'ticket'
  | 'booking'
  | 'passport'
  | 'visa'
  | 'insurance'
  | 'itinerary'
  | 'other';

export interface ItineraryStats {
  totalDistance: number; // km
  totalCost: Money;
  activitiesCount: number;
  destinationsCount: number;
  photosCount: number;
  viewsCount: number;
  sharesCount: number;
  likesCount: number;
  commentsCount: number;
}

export interface SharingSettings {
  isPublic: boolean;
  shareableLink?: string;
  password?: string;
  expiresAt?: Timestamp;
  allowComments: boolean;
  allowCopying: boolean;
  showBudget: boolean;
  showTravelers: boolean;
  embedCode?: string;
  qrCode?: string;
}

export interface ItineraryTemplate {
  id: ID;
  title: string;
  description: string;
  category: string;
  tags: string[];
  duration: number;
  destinations: string[];
  estimatedBudget: {
    min: Money;
    max: Money;
  };
  activities: ActivityTemplate[];
  popularity: number;
  rating: number;
  usageCount: number;
  author: {
    id: ID;
    name: string;
    isVerified: boolean;
  };
}

export interface ActivityTemplate {
  day: number;
  title: string;
  description: string;
  duration: number; // minutes
  category: string;
  estimatedCost?: Money;
  tips?: string[];
}
