import type {
  BaseEntity,
  ID,
  Money,
  Timestamp,
  Email,
  CountryCode,
  URL,
  Currency
} from './common';
import type { Location, ContactInfo, Airport } from './location';
import type { Activity, BookingStatus } from './activity';
import type { PaymentMethod, PaymentStatus } from './payment';
import type { DocumentType } from './itinerary';

export interface Booking extends BaseEntity {
  userId: ID;
  type: BookingType;
  status: BookingStatus;
  referenceNumber: string;
  provider: BookingProvider;
  details: BookingDetails;
  travelers: TravelerInfo[];
  pricing: BookingPricing;
  payment?: PaymentInfo;
  policies: BookingPolicies;
  documents: BookingDocument[];
  timeline: BookingTimeline;
  contact: BookingContact;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export type BookingType =
  | 'flight'
  | 'hotel'
  | 'car'
  | 'activity'
  | 'restaurant'
  | 'train'
  | 'bus'
  | 'cruise'
  | 'package';



export interface BookingProvider {
  name: string;
  logo?: URL;
  website?: URL;
  supportPhone?: string;
  supportEmail?: Email;
}

export type BookingDetails =
  | FlightBooking
  | HotelBooking
  | CarBooking
  | ActivityBooking
  | RestaurantBooking
  | TransportBooking
  | PackageBooking;

export interface FlightBooking {
  type: 'flight';
  flights: Flight[];
  class: CabinClass;
  fareType: FareType;
  baggageAllowance: BaggageAllowance;
  seatSelection?: SeatSelection[];
  meals?: MealPreference[];
  specialServices?: SpecialService[];
}

export interface Flight {
  flightNumber: string;
  airline: Airline;
  aircraft?: Aircraft;
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  duration: number; // minutes
  stops: FlightStop[];
  status: FlightStatus;
  operatedBy?: string;
  codeShare?: string[];
}

export interface Airline {
  code: string;
  name: string;
  logo?: URL;
  alliance?: string;
}

export interface Aircraft {
  code: string;
  name: string;
  configuration?: string;
}

export interface FlightEndpoint {
  airport: Airport;
  terminal?: string;
  gate?: string;
  dateTime: Timestamp;
  timezone: string;
}



export interface FlightStop {
  airport: Airport;
  arrival: Timestamp;
  departure: Timestamp;
  duration: number; // minutes
  changePlane: boolean;
}

export type FlightStatus =
  | 'scheduled'
  | 'on-time'
  | 'delayed'
  | 'boarding'
  | 'departed'
  | 'in-flight'
  | 'landed'
  | 'arrived'
  | 'cancelled'
  | 'diverted';

export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';
export type FareType = 'basic' | 'standard' | 'flexible' | 'premium';

export interface BaggageAllowance {
  cabin: {
    pieces: number;
    weight: number; // kg
    dimensions?: string;
  };
  checked: {
    pieces: number;
    weightPerPiece: number; // kg
    totalWeight?: number; // kg
    dimensions?: string;
  };
  excess?: {
    pricePerKg?: Money;
    pricePerPiece?: Money;
  };
}

export interface SeatSelection {
  flightNumber: string;
  seatNumber: string;
  seatType: SeatType;
  location: SeatLocation;
  price?: Money;
}

export type SeatType =
  | 'standard'
  | 'extra-legroom'
  | 'exit-row'
  | 'bulkhead'
  | 'preferred'
  | 'window'
  | 'aisle'
  | 'middle';

export type SeatLocation = 'window' | 'aisle' | 'middle' | 'bulkhead' | 'exit-row';

export type MealPreference =
  | 'regular'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'halal'
  | 'kosher'
  | 'low-sodium'
  | 'diabetic'
  | 'child'
  | 'infant';

export type SpecialService =
  | 'wheelchair'
  | 'assistance'
  | 'unaccompanied-minor'
  | 'extra-baggage'
  | 'pet-in-cabin'
  | 'medical-equipment'
  | 'special-meal';

export interface HotelBooking {
  type: 'hotel';
  hotel: Hotel;
  rooms: HotelRoom[];
  checkIn: Timestamp;
  checkOut: Timestamp;
  guestInfo: GuestInfo[];
  boardType: BoardType;
  specialRequests?: string[];
}

export interface Hotel {
  name: string;
  chain?: string;
  starRating: number;
  location: Location;
  contact: ContactInfo;
  amenities: string[];
}

export interface HotelRoom {
  roomType: string;
  numberOfGuests: number;
  bedConfiguration: string[];
  price: Money;
  roomNumber?: string;
  floor?: number;
  view?: string;
  smoking: boolean;
  accessibilityFeatures?: string[];
}

export type BoardType =
  | 'room-only'
  | 'breakfast'
  | 'half-board'
  | 'full-board'
  | 'all-inclusive';

export interface GuestInfo {
  title?: 'mr' | 'mrs' | 'ms' | 'miss' | 'dr' | 'prof';
  firstName: string;
  lastName: string;
  nationality?: CountryCode;
  dateOfBirth?: string;
  contact?: {
    phone?: string;
    email?: Email;
  };
}

export interface CarBooking {
  type: 'car';
  rentalCompany: RentalCompany;
  vehicle: Vehicle;
  pickup: BookingEndpoint;
  dropoff: BookingEndpoint;
  insurance: Insurance[];
  extras: CarExtra[];
  driverInfo: DriverInfo;
}

export interface RentalCompany {
  name: string;
  contact: ContactInfo;
  policies: {
    fuel: 'full-to-full' | 'pre-paid' | 'same-to-same';
    mileage: 'unlimited' | 'limited';
    mileageLimit?: number; // km
    additionalDriverFee?: Money;
    youngDriverFee?: Money;
  };
}

export interface Vehicle {
  make: string;
  model: string;
  type: string;
  transmission: 'manual' | 'automatic';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  features: string[];
  capacity: {
    passengers: number;
    luggage: number;
  };
}

export interface BookingEndpoint {
  location: Location;
  dateTime: Timestamp;
  instructions?: string;
}

export interface Insurance {
  type: 'collision' | 'theft' | 'liability' | 'personal';
  coverage: string;
  cost: Money;
  provider: string;
}

export interface CarExtra {
  type: 'gps' | 'child-seat' | 'booster-seat' | 'additional-driver' | 'wifi' | 'other';
  cost: Money;
  quantity: number;
}

export interface DriverInfo {
  licenseNumber: string;
  issuingCountry: CountryCode;
  expiryDate: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
}

export interface ActivityBooking {
  type: 'activity';
  activityId: ID;
  title: string;
  location: Location;
  dateTime: Timestamp;
  duration: number; // minutes
  participants: ActivityParticipant[];
  specialRequests?: string[];
}

export interface ActivityParticipant {
  userId?: ID;
  name: string;
  contact?: {
    email?: Email;
    phone?: string;
  };
}

export interface RestaurantBooking {
  type: 'restaurant';
  restaurant: Restaurant;
  dateTime: Timestamp;
  partySize: number;
  seatingPreference?: string;
  specialRequests?: string[];
}

export interface Restaurant {
  name: string;
  cuisine: string[];
  location: Location;
  contact: ContactInfo;
  dressCode?: 'casual' | 'smart-casual' | 'formal';
  menuUrl?: URL;
}

export interface TransportBooking {
  type: 'train' | 'bus';
  operator: string;
  departure: BookingEndpoint;
  arrival: BookingEndpoint;
  seatAssignments?: SeatAssignment[];
  ticketType: string;
}

export interface SeatAssignment {
  travelerName: string;
  seatNumber: string;
  car?: string; // for trains
  section?: string;
}

export interface PackageBooking {
  type: 'package';
  packageId: ID;
  title: string;
  inclusions: string[];
  itinerary: {
    days: PackageDay[];
  };
  operator: string;
  groupSize: number;
}

export interface PackageDay {
  dayNumber: number;
  date: Timestamp;
  activities: Activity[];
  accommodation?: HotelBooking;
  transport?: TransportBooking;
}

export interface BookingPricing {
  basePrice: Money;
  taxes: Tax[];
  fees: Fee[];
  discounts: Discount[];
  totalPrice: Money;
  depositRequired?: Money;
  currency: Currency;
  exchangeRate?: number;
}

export interface Tax {
  name: string;
  amount: Money;
  percentage?: number;
  included: boolean;
}

export interface Fee {
  name: string;
  amount: Money;
  type: 'mandatory' | 'optional';
  payAt: 'booking' | 'property';
}

export interface Discount {
  type: string;
  description: string;
  amount: Money;
  code?: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: Money;
  transactionId?: string;
  processedAt?: Timestamp;
}





export interface BookingPolicies {
  cancellation: CancellationPolicy;
  modification: ModificationPolicy;
  noShow: NoShowPolicy;
  refund: RefundPolicy;
}

export interface CancellationPolicy {
  type: 'free' | 'flexible' | 'moderate' | 'strict' | 'non-refundable';
  deadline?: Timestamp;
  penalties: Penalty[];
  description: string;
}

export interface Penalty {
  from: Timestamp;
  to?: Timestamp;
  amount: Money;
}

export interface ModificationPolicy {
  allowed: boolean;
  deadline?: Timestamp;
  fee?: Money;
  restrictions: string[];
}

export interface NoShowPolicy {
  penalty: Money;
  gracePeriod?: number; // minutes
  description: string;
}

export interface RefundPolicy {
  method: 'original' | 'credit' | 'voucher';
  processingTime: string;
  conditions: string[];
}

export interface BookingDocument {
  type: DocumentType;
  name: string;
  url: URL;
  format: 'pdf' | 'html' | 'image';
  issuedAt: Timestamp;
  expiresAt?: Timestamp;
}



export interface BookingTimeline {
  created: TimelineEvent;
  confirmed?: TimelineEvent;
  modified?: TimelineEvent[];
  cancelled?: TimelineEvent;
  completed?: TimelineEvent;
  refunded?: TimelineEvent;
}

export interface TimelineEvent {
  timestamp: Timestamp;
  userId: ID;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface BookingContact {
  primary: ContactPerson;
  emergency?: ContactPerson;
}

export interface ContactPerson {
  name?: string;
  phone?: string;
  email?: Email;
  available24x7: boolean;
}

export interface TravelerInfo {
  type: TravelerType;
  title?: 'mr' | 'mrs' | 'ms' | 'miss' | 'dr' | 'prof';
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: CountryCode;
  documents: TravelDocument[];
  contact?: {
    email: Email;
    phone?: string;
    address?: string;
  };
  loyaltyPrograms: LoyaltyProgram[];
  specialNeeds?: {
    dietary?: MealPreference[];
    medical?: string[];
    mobility?: string[];
    other?: string[];
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: Email;
    alternatePhone?: string;
  };
}

export type TravelerType = 'adult' | 'child' | 'infant';

export interface TravelDocument {
  type: DocumentType;
  number: string;
  issuingCountry: CountryCode;
  issuanceDate?: string;
  expiryDate: string;
  nationality?: CountryCode;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other';
}

export interface LoyaltyProgram {
  airline?: string;
  hotel?: string;
  programName: string;
  memberNumber: string;
  tier?: string;
}

