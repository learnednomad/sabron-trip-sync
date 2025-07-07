import { z } from 'zod';

// String transforms
export const stringTransforms = {
  trim: () => z.string().transform((val) => val.trim()),

  toLowerCase: () => z.string().transform((val) => val.toLowerCase()),

  toUpperCase: () => z.string().transform((val) => val.toUpperCase()),

  capitalize: () => z.string().transform((val) =>
    val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
  ),

  removeSpaces: () => z.string().transform((val) => val.replace(/\s+/g, '')),

  normalizeWhitespace: () => z.string().transform((val) =>
    val.replace(/\s+/g, ' ').trim()
  ),

  toSlug: () => z.string().transform((val) =>
    val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  ),

  removeNonAlphanumeric: () => z.string().transform((val) =>
    val.replace(/[^a-zA-Z0-9]/g, '')
  ),

  maskEmail: () => z.string().email().transform((email) => {
    const [local, domain] = email.split('@');
    const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
    return `${maskedLocal}@${domain}`;
  }),

  maskPhone: () => z.string().transform((phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    return '*'.repeat(cleaned.length - 4) + last4;
  }),
};

// Number transforms
export const numberTransforms = {
  round: (decimals: number = 0) =>
    z.number().transform((val) => Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals)),

  floor: () => z.number().transform((val) => Math.floor(val)),

  ceil: () => z.number().transform((val) => Math.ceil(val)),

  abs: () => z.number().transform((val) => Math.abs(val)),

  percentage: () => z.number().transform((val) => val / 100),

  toFixed: (decimals: number = 2) =>
    z.number().transform((val) => parseFloat(val.toFixed(decimals))),

  clamp: (min: number, max: number) =>
    z.number().transform((val) => Math.min(Math.max(val, min), max)),
};

// Date transforms
export const dateTransforms = {
  toISOString: () => z.date().transform((date) => date.toISOString()),

  toDateString: () => z.date().transform((date) => date.toDateString()),

  toTimestamp: () => z.date().transform((date) => date.getTime()),

  startOfDay: () => z.date().transform((date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }),

  endOfDay: () => z.date().transform((date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }),

  addDays: (days: number) => z.date().transform((date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }),

  parseDate: () => z.string().transform((str) => new Date(str)),
};

// Array transforms
export const arrayTransforms = {
  unique: <T>() => z.array(z.any()).transform((arr: T[]) =>
    Array.from(new Set(arr))
  ),

  sort: <T>() => z.array(z.any()).transform((arr: T[]) =>
    [...arr].sort()
  ),

  reverse: <T>() => z.array(z.any()).transform((arr: T[]) =>
    [...arr].reverse()
  ),

  compact: <T>() => z.array(z.any()).transform((arr: T[]) =>
    arr.filter(Boolean)
  ),

  flatten: <T>() => z.array(z.any()).transform((arr: T[][]) =>
    arr.flat()
  ),

  chunk: <T>(size: number) => z.array(z.any()).transform((arr: T[]) => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }),
};

// Object transforms
export const objectTransforms = {
  removeNullish: () =>
    z.record(z.any()).transform((obj: Record<string, any>) => {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
          result[key] = value;
        }
      }
      return result;
    }),

  pick: (keys: string[]) =>
    z.record(z.any()).transform((obj: Record<string, any>) => {
      const result: Record<string, any> = {};
      for (const key of keys) {
        if (key in obj) {
          result[key] = obj[key];
        }
      }
      return result;
    }),

  omit: (keys: string[]) =>
    z.record(z.any()).transform((obj: Record<string, any>) => {
      const result = { ...obj };
      for (const key of keys) {
        delete result[key];
      }
      return result;
    }),

  mapKeys: (
    mapper: (key: string) => string
  ) => z.record(z.any()).transform((obj: Record<string, any>) => {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[mapper(key)] = value;
    }
    return result;
  }),

  mapValues: (
    mapper: (value: any) => any
  ) => z.record(z.any()).transform((obj: Record<string, any>) => {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = mapper(value);
    }
    return result;
  }),
};

// Complex transforms
export const complexTransforms = {
  parseJSON: <T>() => z.string().transform((str) => {
    try {
      return JSON.parse(str) as T;
    } catch {
      throw new Error('Invalid JSON');
    }
  }),

  stringifyJSON: () => z.any().transform((val) => JSON.stringify(val)),

  base64Encode: () => z.string().transform((str) =>
    Buffer.from(str).toString('base64')
  ),

  base64Decode: () => z.string().transform((str) =>
    Buffer.from(str, 'base64').toString('utf-8')
  ),

  csvToArray: () => z.string().transform((csv) =>
    csv.split(',').map(item => item.trim())
  ),

  arrayToCSV: () => z.array(z.string()).transform((arr) =>
    arr.join(', ')
  ),

  enumToOptions: <T extends Record<string, string>>(enumObj: T) =>
    z.enum(Object.values(enumObj) as [string, ...string[]]).transform((val) => ({
      label: val,
      value: val,
    })),
};

// Conditional transforms
export const conditionalTransforms = {
  defaultIfEmpty: <T>(defaultValue: T) =>
    z.any().transform((val) => {
      if (val === '' || val === null || val === undefined) {
        return defaultValue;
      }
      return val;
    }),

  nullIfEmpty: () =>
    z.string().transform((val) => val === '' ? null : val),

  emptyToUndefined: () =>
    z.string().transform((val) => val === '' ? undefined : val),

  booleanFromString: () =>
    z.string().transform((val) => {
      const lower = val.toLowerCase();
      if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on') {
        return true;
      }
      if (lower === 'false' || lower === '0' || lower === 'no' || lower === 'off') {
        return false;
      }
      throw new Error('Invalid boolean string');
    }),
};
