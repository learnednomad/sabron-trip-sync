import * as Sentry from '@sentry/nextjs';
import type { SentryConfig, SentryUser } from '@/types/sentry';

// Initialize Sentry with proper configuration
export const initSentry = (): void => {
  const sentryConfig: SentryConfig = {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === 'production',
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/yourserver\.io\/api/,
    ],
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Release Tracking
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    
    // Error Filtering
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      // Facebook related errors
      'fb_xd_fragment',
      // Network errors
      'NetworkError',
      'Network request failed',
      'Load failed',
      // Safari specific errors
      'Non-Error promise rejection captured',
    ],
    
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      // Other browsers
      /^moz-extension:\/\//i,
      /^safari-extension:\/\//i,
    ],
    
    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Hooks
    beforeSend(event, hint) {
      // Don't send events in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry Event:', event, hint);
        return null;
      }
      
      // Filter out specific errors
      if (event.exception) {
        const error = hint.originalException;
        // Add custom filtering logic here
      }
      
      return event;
    },
    
    beforeSendTransaction(event) {
      // Filter out specific transactions
      if (event.transaction === '/health') {
        return null;
      }
      
      return event;
    },
  };
  
  Sentry.init(sentryConfig);
};

// Set user context for Sentry
export const setSentryUser = (user: SentryUser | null): void => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
      ip_address: user.ip_address,
      // Add any custom user attributes
      ...user,
    });
  } else {
    Sentry.setUser(null);
  }
};

// Clear Sentry user context
export const clearSentryUser = (): void => {
  Sentry.setUser(null);
};

// Add custom context
export const setSentryContext = (key: string, context: Record<string, any>): void => {
  Sentry.setContext(key, context);
};

// Add tags for filtering
export const setSentryTags = (tags: Record<string, string | number | boolean>): void => {
  Sentry.setTags(tags);
};

// Add extra data
export const setSentryExtra = (key: string, data: any): void => {
  Sentry.setExtra(key, data);
};

// Add breadcrumb
export const addSentryBreadcrumb = (message: string, data?: Record<string, any>): void => {
  Sentry.addBreadcrumb({
    message,
    data,
    timestamp: Date.now() / 1000,
  });
};

// Capture custom exception
export const captureException = (error: Error, context?: Record<string, any>): void => {
  if (context) {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach((key) => {
        scope.setExtra(key, context[key]);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

// Capture custom message
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info'): void => {
  Sentry.captureMessage(message, level);
};

// Start transaction for performance monitoring
export const startTransaction = (name: string, op: string): any => {
  return Sentry.startInactiveSpan({
    name,
    op,
  });
};

// Custom error boundary fallback component
export const SentryErrorFallback: React.FC<{
  error: Error;
  resetError: () => void;
  eventId: string | null;
}> = ({ error, resetError, eventId }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
        <p className="text-gray-600">
          We apologize for the inconvenience. The error has been reported to our team.
        </p>
        {eventId && (
          <p className="text-sm text-gray-500">
            Error ID: <code className="font-mono">{eventId}</code>
          </p>
        )}
        <button
          onClick={resetError}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
};