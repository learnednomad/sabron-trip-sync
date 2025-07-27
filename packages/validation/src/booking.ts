import { z } from 'zod';

import {
  IdSchema,
  TimestampSchema,
  MoneySchema,
  EmailSchema,
  CountryCodeSchema,
  PhoneNumberSchema,
  UrlSchema,
} from './common';
import { PaymentMethodSchema } from './payment';

// Booking type
export const BookingTypeSchema = z.enum([
  'flight',
  'hotel',
  'car',
  'activity',
  'restaurant',
  'train',
  'bus',
  'cruise',
  'package',
]);

// Booking status
export const BookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'failed',
  'refunded',
  'modified',
]);

// Cabin class
export const CabinClassSchema = z.enum(['economy', 'premium-economy', 'business', 'first']);

// Fare type
export const FareTypeSchema = z.enum(['basic', 'standard', 'flexible', 'premium']);

// Meal preference
export const MealPreferenceSchema = z.enum([
  'regular',
  'vegetarian',
  'vegan',
  'gluten-free',
  'halal',
  'kosher',
  'low-sodium',
  'diabetic',
  'child',
  'infant',
]);

// Special service
export const SpecialServiceSchema = z.enum([
  'wheelchair',
  'assistance',
  'unaccompanied-minor',
  'extra-baggage',
  'pet-in-cabin',
  'medical-equipment',
  'special-meal',
]);



// Traveler type
export const TravelerTypeSchema = z.enum(['adult', 'child', 'infant']);

// Document type
export const DocumentTypeSchema = z.enum([
  'passport',
  'id-card',
  'drivers-license',
  'visa',
  'vaccination-certificate',
  'insurance',
  'other',
]);

// Loyalty program schema
export const LoyaltyProgramSchema = z.object({
  airline: z.string().max(100).optional(),
  hotel: z.string().max(100).optional(),
  programName: z.string().max(100),
  memberNumber: z.string().max(50),
  tier: z.string().max(50).optional(),
});

// Travel document schema
export const TravelDocumentSchema = z.object({
  type: DocumentTypeSchema,
  number: z.string().min(1).max(50),
  issuingCountry: CountryCodeSchema,
  issuanceDate: z.string().date().optional(),
  expiryDate: z.string().date(),
  nationality: CountryCodeSchema.optional(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  dateOfBirth: z.string().date(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Traveler info schema
export const TravelerInfoSchema = z.object({
  type: TravelerTypeSchema,
  title: z.enum(['mr', 'mrs', 'ms', 'miss', 'dr', 'prof']).optional(),
  firstName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().date(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  nationality: CountryCodeSchema.optional(),
  documents: z.array(TravelDocumentSchema).default([]),
  contact: z
    .object({
      email: EmailSchema,
      phone: PhoneNumberSchema.optional(),
      address: z.string().max(500).optional(),
    })
    .optional(),
  loyaltyPrograms: z.array(LoyaltyProgramSchema).default([]),
  specialNeeds: z
    .object({
      dietary: z.array(MealPreferenceSchema).optional(),
      medical: z.array(z.string().max(100)).optional(),
      mobility: z.array(z.string().max(100)).optional(),
      other: z.array(z.string().max(100)).optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().min(1).max(200),
      relationship: z.string().min(1).max(50),
      phone: PhoneNumberSchema,
      email: EmailSchema.optional(),
      alternatePhone: PhoneNumberSchema.optional(),
    })
    .optional(),
});

// Flight search schema
export const FlightSearchSchema = z.object({
  origin: z.string().length(3), // IATA code
  destination: z.string().length(3), // IATA code
  departureDate: z.string().date(),
  returnDate: z.string().date().optional(),
  passengers: z.object({
    adults: z.number().int().positive().max(9).default(1),
    children: z.number().int().nonnegative().max(9).default(0),
    infants: z.number().int().nonnegative().max(9).default(0),
  }),
  cabinClass: CabinClassSchema.default('economy'),
  directFlightsOnly: z.boolean().default(false),
  flexibleDates: z.boolean().default(false),
  nearbyAirports: z.boolean().default(true),
  preferredAirlines: z.array(z.string()).optional(),
  excludedAirlines: z.array(z.string()).optional(),
  maxStops: z.number().int().min(0).max(3).optional(),
  maxDuration: z.number().positive().optional(), // hours
  baggage: z
    .object({
      carry: z.number().int().nonnegative().default(1),
      checked: z.number().int().nonnegative().default(0),
    })
    .optional(),
});

// Hotel search schema
export const HotelSearchSchema = z.object({
  location: z.string().min(1).max(200),
  checkIn: z.string().date(),
  checkOut: z.string().date(),
  guests: z.object({
    adults: z.number().int().positive().max(10).default(2),
    children: z.number().int().nonnegative().max(10).default(0),
    childrenAges: z.array(z.number().int().min(0).max(17)).optional(),
  }),
  rooms: z.number().int().positive().max(10).default(1),
  priceRange: z
    .object({
      min: z.number().nonnegative(),
      max: z.number().positive(),
      currency: z.string().length(3),
    })
    .optional(),
  starRating: z.array(z.number().int().min(1).max(5)).optional(),
  amenities: z.array(z.string()).optional(),
  propertyTypes: z.array(z.string()).optional(),
  chains: z.array(z.string()).optional(),
  mealPlan: z.enum(['room-only', 'breakfast', 'half-board', 'full-board', 'all-inclusive']).optional(),
  paymentOptions: z.array(z.enum(['pay-now', 'pay-later', 'free-cancellation'])).optional(),
  accessibility: z.array(z.string()).optional(),
  distanceFrom: z
    .object({
      location: z.string(),
      maxDistance: z.number().positive(), // km
    })
    .optional(),
});

// Car rental search schema
export const CarRentalSearchSchema = z.object({
  pickupLocation: z.string().min(1).max(200),
  dropoffLocation: z.string().min(1).max(200).optional(),
  pickupDate: z.string().datetime(),
  dropoffDate: z.string().datetime(),
  driverAge: z.number().int().min(18).max(99).default(25),
  carType: z
    .enum(['economy', 'compact', 'midsize', 'fullsize', 'premium', 'luxury', 'suv', 'minivan', 'convertible'])
    .optional(),
  transmission: z.enum(['manual', 'automatic']).optional(),
  fuelType: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']).optional(),
  features: z.array(z.string()).optional(),
  suppliers: z.array(z.string()).optional(),
  insurance: z
    .object({
      collision: z.boolean().default(false),
      theft: z.boolean().default(false),
      liability: z.boolean().default(true),
      personal: z.boolean().default(false),
    })
    .optional(),
});

// Create booking schema
export const CreateBookingSchema = z.object({
  type: BookingTypeSchema,
  status: BookingStatusSchema.default('pending'),
  referenceNumber: z.string().max(100).optional(),
  provider: z.object({
    name: z.string().min(1).max(100),
    logo: UrlSchema.optional(),
    website: UrlSchema.optional(),
    supportPhone: PhoneNumberSchema.optional(),
    supportEmail: EmailSchema.optional(),
  }),
  travelers: z.array(TravelerInfoSchema).min(1),
  pricing: z.object({
    basePrice: MoneySchema,
    taxes: z.array(
      z.object({
        name: z.string().max(100),
        amount: MoneySchema,
        percentage: z.number().optional(),
        included: z.boolean().default(false),
      })
    ).default([]),
    fees: z.array(
      z.object({
        name: z.string().max(100),
        amount: MoneySchema,
        type: z.enum(['mandatory', 'optional']).default('mandatory'),
        payAt: z.enum(['booking', 'property']).default('booking'),
      })
    ).default([]),
    discounts: z.array(
      z.object({
        type: z.string().max(50),
        description: z.string().max(200),
        amount: MoneySchema,
        code: z.string().max(50).optional(),
      })
    ).default([]),
    totalPrice: MoneySchema,
    depositRequired: MoneySchema.optional(),
    currency: z.string().length(3),
    exchangeRate: z.number().positive().optional(),
  }),
  payment: z
    .object({
      method: PaymentMethodSchema,
      status: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']),
      amount: MoneySchema,
      transactionId: z.string().optional(),
      processedAt: TimestampSchema.optional(),
    })
    .optional(),
  policies: z.object({
    cancellation: z.object({
      type: z.enum(['free', 'flexible', 'moderate', 'strict', 'non-refundable']),
      deadline: TimestampSchema.optional(),
      penalties: z.array(
        z.object({
          from: TimestampSchema,
          to: TimestampSchema.optional(),
          amount: MoneySchema,
        })
      ).default([]),
      description: z.string().max(1000),
    }),
    modification: z.object({
      allowed: z.boolean(),
      deadline: TimestampSchema.optional(),
      fee: MoneySchema.optional(),
      restrictions: z.array(z.string().max(200)).default([]),
    }),
    noShow: z.object({
      penalty: MoneySchema,
      gracePeriod: z.number().nonnegative().optional(), // minutes
      description: z.string().max(500),
    }),
    refund: z.object({
      method: z.enum(['original', 'credit', 'voucher']),
      processingTime: z.string().max(100),
      conditions: z.array(z.string().max(200)).default([]),
    }),
  }),
  documents: z.array(
    z.object({
      type: z.enum([
        'booking-confirmation',
        'e-ticket',
        'voucher',
        'invoice',
        'receipt',
        'itinerary',
        'boarding-pass',
        'visa',
        'insurance',
        'other',
      ]),
      name: z.string().max(200),
      url: UrlSchema,
      format: z.enum(['pdf', 'html', 'image']),
      issuedAt: TimestampSchema,
      expiresAt: TimestampSchema.optional(),
    })
  ).default([]),
  contact: z.object({
    primary: z.object({
      name: z.string().max(200).optional(),
      phone: PhoneNumberSchema.optional(),
      email: EmailSchema.optional(),
      available24x7: z.boolean().default(false),
    }),
    emergency: z
      .object({
        name: z.string().max(200).optional(),
        phone: PhoneNumberSchema.optional(),
        email: EmailSchema.optional(),
      })
      .optional(),
  }),
  notes: z.string().max(2000).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Update booking schema
export const UpdateBookingSchema = z.object({
  status: BookingStatusSchema.optional(),
  travelers: z.array(TravelerInfoSchema).optional(),
  notes: z.string().max(2000).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Cancel booking schema
export const CancelBookingSchema = z.object({
  reason: z.enum([
    'changed-plans',
    'found-better-option',
    'emergency',
    'weather',
    'health',
    'visa-issues',
    'other',
  ]),
  description: z.string().max(500).optional(),
  requestRefund: z.boolean().default(true),
});

// Request refund schema
export const RequestRefundSchema = z.object({
  bookingId: IdSchema,
  reason: z.enum([
    'duplicate',
    'fraudulent',
    'service-not-provided',
    'quality-issue',
    'cancellation',
    'other',
  ]),
  amount: MoneySchema.optional(),
  description: z.string().max(1000),
  evidence: z.array(UrlSchema).max(5).optional(),
});

// Export types
export type BookingType = z.infer<typeof BookingTypeSchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type CabinClass = z.infer<typeof CabinClassSchema>;
export type FareType = z.infer<typeof FareTypeSchema>;
export type MealPreference = z.infer<typeof MealPreferenceSchema>;
export type SpecialService = z.infer<typeof SpecialServiceSchema>;
export type TravelerType = z.infer<typeof TravelerTypeSchema>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type LoyaltyProgram = z.infer<typeof LoyaltyProgramSchema>;
export type TravelDocument = z.infer<typeof TravelDocumentSchema>;
export type TravelerInfo = z.infer<typeof TravelerInfoSchema>;
export type FlightSearch = z.infer<typeof FlightSearchSchema>;
export type HotelSearch = z.infer<typeof HotelSearchSchema>;
export type CarRentalSearch = z.infer<typeof CarRentalSearchSchema>;
export type CreateBooking = z.infer<typeof CreateBookingSchema>;
export type UpdateBooking = z.infer<typeof UpdateBookingSchema>;
export type CancelBooking = z.infer<typeof CancelBookingSchema>;
export type RequestRefund = z.infer<typeof RequestRefundSchema>;