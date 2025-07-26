import { describe, expect, it } from 'vitest';
import { RegisterSchema, PasswordSchema } from '../auth';

describe('Auth Validation', () => {
  describe('PasswordSchema', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'Pass123!',
        'MyP@ssw0rd',
        'Str0ng!Pass',
        'Test@1234',
        'P@ssw0rd!123',
      ];

      validPasswords.forEach((password) => {
        const result = PasswordSchema.safeParse(password);
        expect(result.success).toBe(true);
      });
    });

    it('should reject passwords that are too short', () => {
      const result = PasswordSchema.safeParse('Pass1!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters');
      }
    });

    it('should reject passwords without uppercase letter', () => {
      const result = PasswordSchema.safeParse('password123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase letter');
      }
    });

    it('should reject passwords without lowercase letter', () => {
      const result = PasswordSchema.safeParse('PASSWORD123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('lowercase letter');
      }
    });

    it('should reject passwords without numbers', () => {
      const result = PasswordSchema.safeParse('Password!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('number');
      }
    });

    it('should reject passwords without special characters', () => {
      const result = PasswordSchema.safeParse('Password123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('special character');
      }
    });

    it('should reject passwords that are too long', () => {
      const longPassword = 'P@ssw0rd' + 'a'.repeat(100);
      const result = PasswordSchema.safeParse(longPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 100 characters');
      }
    });
  });

  describe('RegisterSchema', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Pass123!',
      confirmPassword: 'Pass123!',
      name: 'John Doe',
      acceptTerms: true,
      marketingConsent: false,
    };

    it('should accept valid registration data', () => {
      const result = RegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject when passwords do not match', () => {
      const data = {
        ...validData,
        confirmPassword: 'Different123!',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match');
      }
    });

    it('should reject when terms are not accepted', () => {
      const data = {
        ...validData,
        acceptTerms: false,
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('You must accept the terms and conditions');
      }
    });

    it('should sanitize email to lowercase', () => {
      const data = {
        ...validData,
        email: 'Test@EXAMPLE.com',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should reject invalid email format', () => {
      const data = {
        ...validData,
        email: 'invalid-email',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject short names', () => {
      const data = {
        ...validData,
        name: 'J',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should allow optional username', () => {
      const dataWithUsername = {
        ...validData,
        username: 'johndoe123',
      };
      const result = RegisterSchema.safeParse(dataWithUsername);
      expect(result.success).toBe(true);
    });

    it('should allow optional referral code', () => {
      const dataWithReferral = {
        ...validData,
        referralCode: 'REF123',
      };
      const result = RegisterSchema.safeParse(dataWithReferral);
      expect(result.success).toBe(true);
    });
  });
});