import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Release Tracking
  release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  environment: process.env.NODE_ENV,
  
  // Debug
  debug: process.env.NODE_ENV === 'development',
  
  // Edge Runtime specific options
  transportOptions: {
    // Increase the timeout for edge runtime
    fetchOptions: {
      keepalive: true,
    },
  },
  
  beforeSend(event, hint) {
    // Filter out errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry Edge]', event, hint);
      return null;
    }
    
    return event;
  },
});