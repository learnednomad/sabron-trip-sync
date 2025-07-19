// Email validation and sanitization
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Phone number validation (basic implementation for React Native compatibility)
export function isValidPhoneNumber(phone: string): boolean {
  try {
    // Basic international phone number validation
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  } catch {
    return false;
  }
}

export function formatPhoneNumber(phone: string): string {
  try {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  } catch {
    return phone;
  }
}

// Password validation
export function isStrongPassword(password: string): boolean {
  // At least 8 characters
  if (password.length < 8) return false;

  // Contains uppercase letter
  if (!/[A-Z]/.test(password)) return false;

  // Contains lowercase letter
  if (!/[a-z]/.test(password)) return false;

  // Contains number
  if (!/[0-9]/.test(password)) return false;

  // Contains special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;

  return true;
}

// Username validation
export function isValidUsername(username: string): boolean {
  // Only letters, numbers, underscores, and hyphens
  // Must start with a letter
  // Length between 3-30 characters
  return /^[a-zA-Z][a-zA-Z0-9_-]{2,29}$/.test(username);
}

export function sanitizeUsername(username: string): string {
  // Remove spaces and convert to lowercase
  return username.trim().toLowerCase().replace(/\s+/g, '');
}

// HTML sanitization (basic - in production use a library like DOMPurify)
export function sanitizeHtml(html: string): string {
  // Remove script tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  html = html.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
  html = html.replace(/on\w+\s*=\s*'[^']*'/gi, '');
  html = html.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: URLs
  html = html.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"');
  html = html.replace(/href\s*=\s*'javascript:[^']*'/gi, 'href="#"');

  return html.trim();
}

// Credit card validation
export function isValidCardNumber(cardNumber: string): boolean {
  // Remove spaces and hyphens
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) return false;

  // Check length (13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function getCardBrand(cardNumber: string): string | null {
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Visa
  if (/^4/.test(cleaned)) return 'visa';

  // Mastercard
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';

  // American Express
  if (/^3[47]/.test(cleaned)) return 'amex';

  // Discover
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';

  // Diners Club
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'diners';

  // JCB
  if (/^35/.test(cleaned)) return 'jcb';

  // UnionPay
  if (/^62/.test(cleaned)) return 'unionpay';

  return null;
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Slug generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Date validation
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
}

export function isPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

// Number formatting
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', options).format(num);
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// File validation
export function isValidFileSize(sizeInBytes: number, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
}

export function isValidFileType(fileName: string, allowedExtensions: string[]): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

// Array utilities
export function uniqueArray<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Object utilities
export function omitUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}

// String utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

// Validation error formatting
export function formatValidationErrors(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('; ');
}
