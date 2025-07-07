import * as Sentry from '@sentry/node';
import type { AppContext } from './types';

export function initSentry() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }
}

export function sentryMiddleware() {
  return async (c: AppContext, next: () => Promise<void>) => {
    return Sentry.withScope(async (scope) => {
      scope.setTransactionName(`${c.req.method} ${c.req.path}`);
      c.set('sentry', Sentry);
      return next();
    });
  };
}
