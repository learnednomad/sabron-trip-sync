import type { BrowserOptions, ErrorBoundaryProps as SentryErrorBoundaryProps } from '@sentry/nextjs';

// Sentry Configuration Types
export interface SentryConfig extends BrowserOptions {
  dsn: string;
  environment?: string;
  integrations?: any[];
  tracesSampleRate?: number;
  tracePropagationTargets?: (string | RegExp)[];
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
  beforeSend?: (event: any, hint: any) => any;
  beforeSendTransaction?: (event: any, hint: any) => any;
  ignoreErrors?: (string | RegExp)[];
  denyUrls?: (string | RegExp)[];
  allowUrls?: (string | RegExp)[];
  debug?: boolean;
  enabled?: boolean;
  release?: string;
  dist?: string;
  maxBreadcrumbs?: number;
  attachStacktrace?: boolean;
  sampleRate?: number;
  maxValueLength?: number;
  normalizeDepth?: number;
  shutdownTimeout?: number;
  autoSessionTracking?: boolean;
  sendClientReports?: boolean;
}

// Sentry User Context
export interface SentryUser {
  id?: string;
  username?: string;
  email?: string;
  ip_address?: string;
  segment?: string;
  [key: string]: any;
}

// Sentry Context Types
export interface SentryContext {
  [key: string]: any;
}

export interface SentryBreadcrumb {
  timestamp?: number;
  message?: string;
  category?: string;
  level?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  type?: string;
  data?: Record<string, any>;
}

// Sentry Error Boundary Types
export interface ErrorBoundaryProps extends SentryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    resetError: () => void;
    eventId: string | null;
  }>;
  showDialog?: boolean;
  dialogOptions?: {
    title?: string;
    subtitle?: string;
    subtitle2?: string;
    labelName?: string;
    labelEmail?: string;
    labelComments?: string;
    labelClose?: string;
    labelSubmit?: string;
    errorGeneric?: string;
    errorFormEntry?: string;
    successMessage?: string;
    onLoad?: () => void;
    onClose?: () => void;
  };
  onError?: (error: Error, errorInfo: { componentStack: string }, eventId: string) => void;
  onReset?: () => void;
  onUnmount?: (error: Error | null, errorInfo: { componentStack: string } | null, eventId: string | null) => void;
  beforeCapture?: (scope: any, error: Error | null, errorInfo: { componentStack: string } | null) => void;
}

// Sentry Transaction Types
export interface SentryTransaction {
  name: string;
  op?: string;
  tags?: Record<string, string | number | boolean>;
  data?: Record<string, any>;
  startTimestamp?: number;
  endTimestamp?: number;
  status?: 'ok' | 'cancelled' | 'unknown' | 'invalid_argument' | 'deadline_exceeded' | 'not_found' | 'already_exists' | 'permission_denied' | 'resource_exhausted' | 'failed_precondition' | 'aborted' | 'out_of_range' | 'unimplemented' | 'internal_error' | 'unavailable' | 'data_loss' | 'unauthenticated';
}

// Sentry Span Types
export interface SentrySpan {
  op?: string;
  description?: string;
  tags?: Record<string, string | number | boolean>;
  data?: Record<string, any>;
  startTimestamp?: number;
  endTimestamp?: number;
  status?: 'ok' | 'cancelled' | 'unknown' | 'invalid_argument' | 'deadline_exceeded' | 'not_found' | 'already_exists' | 'permission_denied' | 'resource_exhausted' | 'failed_precondition' | 'aborted' | 'out_of_range' | 'unimplemented' | 'internal_error' | 'unavailable' | 'data_loss' | 'unauthenticated';
}

// Sentry Integration Types
export interface SentryIntegration {
  name: string;
  setupOnce?: () => void;
}

// Sentry Performance Monitoring
export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

// Sentry Replay Types
export interface ReplayOptions {
  maskAllText?: boolean;
  maskAllInputs?: boolean;
  blockAllMedia?: boolean;
  blockClass?: string | RegExp;
  blockSelector?: string;
  ignoreClass?: string | RegExp;
  maskTextClass?: string | RegExp;
  maskTextSelector?: string;
  maskInputOptions?: {
    color?: boolean;
    date?: boolean;
    'datetime-local'?: boolean;
    email?: boolean;
    month?: boolean;
    number?: boolean;
    range?: boolean;
    search?: boolean;
    tel?: boolean;
    text?: boolean;
    time?: boolean;
    url?: boolean;
    week?: boolean;
    textarea?: boolean;
    select?: boolean;
    password?: boolean;
  };
  privacyOptions?: {
    maskAllText?: boolean;
    maskAllInputs?: boolean;
    maskTextContent?: boolean;
    maskTextSelector?: string;
    unmaskTextSelector?: string;
  };
}

// Sentry Event Types
export interface SentryEvent {
  event_id?: string;
  timestamp?: number;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  platform?: string;
  logger?: string;
  server_name?: string;
  release?: string;
  dist?: string;
  environment?: string;
  sdk?: {
    name: string;
    version: string;
    integrations?: string[];
    packages?: Array<{
      name: string;
      version: string;
    }>;
  };
  request?: {
    url?: string;
    method?: string;
    data?: any;
    query_string?: string;
    cookies?: string | Record<string, string>;
    headers?: Record<string, string>;
    env?: Record<string, string>;
  };
  contexts?: Record<string, SentryContext>;
  tags?: Record<string, string | number | boolean>;
  extra?: Record<string, any>;
  fingerprint?: string[];
  user?: SentryUser;
  breadcrumbs?: SentryBreadcrumb[];
  exception?: {
    values?: Array<{
      type?: string;
      value?: string;
      module?: string;
      thread_id?: number;
      mechanism?: {
        type?: string;
        handled?: boolean;
        data?: Record<string, any>;
      };
      stacktrace?: {
        frames?: Array<{
          filename?: string;
          function?: string;
          module?: string;
          lineno?: number;
          colno?: number;
          abs_path?: string;
          context_line?: string;
          pre_context?: string[];
          post_context?: string[];
          in_app?: boolean;
          vars?: Record<string, any>;
        }>;
      };
    }>;
  };
  message?: {
    formatted?: string;
    message?: string;
    params?: any[];
  };
  transaction?: string;
  modules?: Record<string, string>;
}

// Sentry Scope Types
export interface SentryScope {
  setUser(user: SentryUser | null): void;
  setTag(key: string, value: string | number | boolean): void;
  setTags(tags: Record<string, string | number | boolean>): void;
  setExtra(key: string, extra: any): void;
  setExtras(extras: Record<string, any>): void;
  setContext(key: string, context: SentryContext | null): void;
  setLevel(level: 'fatal' | 'error' | 'warning' | 'info' | 'debug'): void;
  setFingerprint(fingerprint: string[]): void;
  setTransaction(transaction: string): void;
  setSpan(span: SentrySpan | undefined): void;
  clear(): void;
  addBreadcrumb(breadcrumb: SentryBreadcrumb, maxBreadcrumbs?: number): void;
  clearBreadcrumbs(): void;
}

// Sentry Hub Types
export interface SentryHub {
  getClient(): any;
  getScope(): SentryScope;
  configureScope(callback: (scope: SentryScope) => void): void;
  pushScope(): SentryScope;
  popScope(): boolean;
  withScope(callback: (scope: SentryScope) => void): void;
  captureException(exception: any, captureContext?: any): string;
  captureMessage(message: string, captureContext?: any): string;
  captureEvent(event: SentryEvent, hint?: any): string;
  lastEventId(): string | undefined;
  addBreadcrumb(breadcrumb: SentryBreadcrumb): void;
  setUser(user: SentryUser | null): void;
  setTags(tags: Record<string, string | number | boolean>): void;
  setTag(key: string, value: string | number | boolean): void;
  setExtra(key: string, extra: any): void;
  setExtras(extras: Record<string, any>): void;
  setContext(name: string, context: SentryContext | null): void;
  startTransaction(context: any, customSamplingContext?: any): any;
}