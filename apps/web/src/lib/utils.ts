import { type ClassValue, clsx } from 'clsx';
import { format, formatRelative, isValid } from 'date-fns';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and merges Tailwind classes with twMerge.
 * @param inputs - Array of class values.
 * @returns Merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to 'PPP' format (e.g., 'Jan 1, 2025').
 * @param date - Date, string, or number to format.
 * @returns Formatted date string or empty string if invalid.
 */
export function formatDate(date: Date | string | number): string {
  const parsedDate = new Date(date);
  return isValid(parsedDate) ? format(parsedDate, 'PPP') : '';
}

/**
 * Formats a date with time to 'PPP p' format (e.g., 'Jan 1, 2025 2:30 PM').
 * @param date - Date, string, or number to format.
 * @returns Formatted datetime string or empty string if invalid.
 */
export function formatDateTime(date: Date | string | number): string {
  const parsedDate = new Date(date);
  return isValid(parsedDate) ? format(parsedDate, 'PPP p') : '';
}

/**
 * Formats a date as relative time (e.g., '2 hours ago').
 * @param date - Date, string, or number to format.
 * @param baseDate - Base date for comparison (defaults to now).
 * @returns Relative time string or empty string if invalid.
 */
export function formatRelativeTime(
    date: Date | string | number,
    baseDate: Date = new Date()
): string {
  const parsedDate = new Date(date);
  return isValid(parsedDate) ? formatRelative(parsedDate, baseDate) : '';
}

/**
 * Formats duration in minutes to human-readable string (e.g., '2h 30m').
 * @param minutes - Duration in minutes.
 * @returns Formatted duration string.
 * @throws Error if minutes is negative.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 0) {
    throw new Error('Duration cannot be negative');
  }
  if (minutes === 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Formats a number as currency (e.g., '$1,234.56').
 * @param amount - Amount to format.
 * @param currency - Currency code (defaults to 'USD').
 * @returns Formatted currency string.
 * @throws Error if currency code is invalid.
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    throw new Error(`Invalid currency code: ${currency}`);
  }
}

/**
 * Truncates a string to a specified length with ellipsis.
 * @param str - String to truncate.
 * @param length - Maximum length before truncation.
 * @returns Truncated string.
 * @throws Error if length is negative.
 */
export function truncate(str: string, length: number): string {
  if (length < 0) {
    throw new Error('Truncation length cannot be negative');
  }
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Debounces a function to limit its execution rate.
 * @param func - Function to debounce.
 * @param wait - Wait time in milliseconds.
 * @returns Debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
  if (wait < 0) {
    throw new Error('Debounce wait time cannot be negative');
  }
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, wait);
  };
}

/**
 * Generates initials from a name (e.g., 'John Doe' -> 'JD').
 * @param name - Full name.
 * @returns Up to two uppercase initials or empty string if invalid.
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '';
  const initials = name
      .trim()
      .split(/\s+/)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  return initials.slice(0, 2);
}

/**
 * Checks if the code is running on the server.
 * @returns True if running on server, false otherwise.
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Gets the base URL for the application.
 * @returns Base URL based on environment.
 */
export function getBaseUrl(): string {
  if (!isServer()) {
    return '';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3001}`;
}