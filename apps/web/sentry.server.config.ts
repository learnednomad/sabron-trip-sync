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
  
  // Server-specific options
  autoSessionTracking: false,
  
  integrations: [
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  
  beforeSend(event, hint) {
    // Filter out errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry Server]', event, hint);
      return null;
    }
    
    // Don't send health check errors
    if (event.request?.url?.includes('/api/health')) {
      return null;
    }
    
    return event;
  },
  
  beforeSendTransaction(event) {
    // Filter out specific transactions
    if (event.transaction === '/api/health') {
      return null;
    }
    
    return event;
  },
});