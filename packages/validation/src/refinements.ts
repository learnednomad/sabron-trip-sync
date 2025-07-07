import { z } from 'zod';

// Date refinements
export const dateRefinements = {
  isFuture: (date: Date | string, message = 'Date must be in the future') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj > new Date() || message;
  },

  isPast: (date: Date | string, message = 'Date must be in the past') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date() || message;
  },

  isWithinRange: (
    date: Date | string,
    start: Date | string,
    end: Date | string,
    message = 'Date must be within range'
  ) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const startObj = typeof start === 'string' ? new Date(start) : start;
    const endObj = typeof end === 'string' ? new Date(end) : end;
    return (dateObj >= startObj && dateObj <= endObj) || message;
  },

  isBusinessDay: (date: Date | string, message = 'Date must be a business day') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const day = dateObj.getDay();
    return (day !== 0 && day !== 6) || message; // Not Sunday (0) or Saturday (6)
  },
};

// String refinements
export const stringRefinements = {
  noWhitespace: (str: string, message = 'Must not contain whitespace') => {
    return !/\s/.test(str) || message;
  },

  alphanumericOnly: (str: string, message = 'Must contain only letters and numbers') => {
    return /^[a-zA-Z0-9]+$/.test(str) || message;
  },

  noSpecialChars: (str: string, message = 'Must not contain special characters') => {
    return /^[a-zA-Z0-9\s]+$/.test(str) || message;
  },

  validHexColor: (str: string, message = 'Must be a valid hex color') => {
    return /^#[0-9A-F]{6}$/i.test(str) || message;
  },

  validSlug: (str: string, message = 'Must be a valid URL slug') => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str) || message;
  },
};

// Number refinements
export const numberRefinements = {
  isPositive: (num: number, message = 'Must be a positive number') => {
    return num > 0 || message;
  },

  isNegative: (num: number, message = 'Must be a negative number') => {
    return num < 0 || message;
  },

  isInteger: (num: number, message = 'Must be an integer') => {
    return Number.isInteger(num) || message;
  },

  isDivisibleBy: (num: number, divisor: number, message?: string) => {
    return num % divisor === 0 || message || `Must be divisible by ${divisor}`;
  },

  isInRange: (num: number, min: number, max: number, message?: string) => {
    return (num >= min && num <= max) || message || `Must be between ${min} and ${max}`;
  },
};

// Array refinements
export const arrayRefinements = {
  uniqueValues: <T>(arr: T[], message = 'Array must contain unique values') => {
    return new Set(arr).size === arr.length || message;
  },

  hasMinLength: <T>(arr: T[], min: number, message?: string) => {
    return arr.length >= min || message || `Array must have at least ${min} items`;
  },

  hasMaxLength: <T>(arr: T[], max: number, message?: string) => {
    return arr.length <= max || message || `Array must have at most ${max} items`;
  },

  containsValue: <T>(arr: T[], value: T, message?: string) => {
    return arr.includes(value) || message || `Array must contain ${value}`;
  },

  notEmpty: <T>(arr: T[], message = 'Array must not be empty') => {
    return arr.length > 0 || message;
  },
};

// Object refinements
export const objectRefinements = {
  hasRequiredKeys: <T extends Record<string, any>>(
    obj: T,
    keys: (keyof T)[],
    message = 'Object is missing required keys'
  ) => {
    return keys.every(key => key in obj) || message;
  },

  atLeastOneKey: <T extends Record<string, any>>(
    obj: T,
    keys: (keyof T)[],
    message = 'Object must have at least one of the specified keys'
  ) => {
    return keys.some(key => key in obj && obj[key] !== undefined) || message;
  },

  mutuallyExclusive: <T extends Record<string, any>>(
    obj: T,
    keys: (keyof T)[],
    message = 'Object keys are mutually exclusive'
  ) => {
    const presentKeys = keys.filter(key => key in obj && obj[key] !== undefined);
    return presentKeys.length <= 1 || message;
  },
};

// Cross-field refinements
export const crossFieldRefinements = {
  passwordsMatch: (
    password: string,
    confirmPassword: string,
    message = 'Passwords do not match'
  ) => {
    return password === confirmPassword || message;
  },

  endDateAfterStartDate: (
    startDate: Date | string,
    endDate: Date | string,
    message = 'End date must be after start date'
  ) => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    return end > start || message;
  },

  sumEquals: (
    values: number[],
    total: number,
    message?: string
  ) => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum === total || message || `Sum must equal ${total}`;
  },
};

// Custom Zod refinement helpers
export const zodRefinements = {
  // File size validation
  maxFileSize: (maxSizeInMB: number) => {
    return z.number().refine(
      (size) => size <= maxSizeInMB * 1024 * 1024,
      `File size must be less than ${maxSizeInMB}MB`
    );
  },

  // Coordinate validation
  validLatitude: () => {
    return z.number().refine(
      (lat) => lat >= -90 && lat <= 90,
      'Latitude must be between -90 and 90'
    );
  },

  validLongitude: () => {
    return z.number().refine(
      (lng) => lng >= -180 && lng <= 180,
      'Longitude must be between -180 and 180'
    );
  },

  // Age validation
  minimumAge: (minAge: number) => {
    return z.string().refine((dateStr) => {
      const birthDate = new Date(dateStr);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= minAge;
      }

      return age >= minAge;
    }, `Must be at least ${minAge} years old`);
  },
};
