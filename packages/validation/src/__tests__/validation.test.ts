import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  EmailSchema,
  PasswordSchema,
  PhoneNumberSchema,
  LoginSchema,
  RegisterSchema,
  CreateItinerarySchema,
} from '../index';

describe('Validation Schemas', () => {
  describe('Common Schemas', () => {
    it('validates email correctly', () => {
      expect(() => EmailSchema.parse('test@example.com')).not.toThrow();
      expect(() => EmailSchema.parse('TEST@EXAMPLE.COM')).not.toThrow();
      expect(() => EmailSchema.parse('invalid-email')).toThrow();
      expect(() => EmailSchema.parse('')).toThrow();
    });

    it('validates phone number correctly', () => {
      expect(() => PhoneNumberSchema.parse('+1234567890')).not.toThrow();
      expect(() => PhoneNumberSchema.parse('invalid-phone')).toThrow();
    });
  });

  describe('Auth Schemas', () => {
    it('validates password requirements', () => {
      expect(() => PasswordSchema.parse('ValidPass123!')).not.toThrow();
      expect(() => PasswordSchema.parse('weak')).toThrow();
      expect(() => PasswordSchema.parse('NoNumbers!')).toThrow();
      expect(() => PasswordSchema.parse('nouppercase123!')).toThrow();
      expect(() => PasswordSchema.parse('NOLOWERCASE123!')).toThrow();
      expect(() => PasswordSchema.parse('NoSpecialChar123')).toThrow();
    });

    it('validates login schema', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      };
      expect(() => LoginSchema.parse(validLogin)).not.toThrow();
    });

    it('validates registration schema', () => {
      const validRegistration = {
        email: 'test@example.com',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!',
        name: 'Test User',
        acceptTerms: true,
      };
      expect(() => RegisterSchema.parse(validRegistration)).not.toThrow();

      const passwordMismatch = {
        ...validRegistration,
        confirmPassword: 'DifferentPass123!',
      };
      expect(() => RegisterSchema.parse(passwordMismatch)).toThrow();
    });
  });

  describe('Itinerary Schemas', () => {
    it('validates create itinerary schema', () => {
      const validItinerary = {
        title: 'European Adventure',
        description: 'A two-week trip across Europe',
        destinations: [
          {
            name: 'Paris',
            country: 'France',
            coordinates: { lat: 48.8566, lng: 2.3522 },
            timezone: 'Europe/Paris',
          },
        ],
        dateRange: {
          start: '2024-07-01T00:00:00Z',
          end: '2024-07-14T00:00:00Z',
        },
        status: 'draft',
        visibility: 'private',
        tags: ['europe', 'summer'],
      };
      expect(() => CreateItinerarySchema.parse(validItinerary)).not.toThrow();
    });

    it('rejects invalid date ranges', () => {
      const invalidDateRange = {
        title: 'Invalid Trip',
        destinations: [
          {
            name: 'Paris',
            country: 'France',
            coordinates: { lat: 48.8566, lng: 2.3522 },
            timezone: 'Europe/Paris',
          },
        ],
        dateRange: {
          start: '2024-07-14T00:00:00Z',
          end: '2024-07-01T00:00:00Z', // End before start
        },
      };
      expect(() => CreateItinerarySchema.parse(invalidDateRange)).toThrow();
    });
  });
});
