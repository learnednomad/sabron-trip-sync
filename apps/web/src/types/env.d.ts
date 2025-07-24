/// <reference types="next" />

declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL: string;
    
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_KEY: string;
    
    // Sentry
    NEXT_PUBLIC_SENTRY_DSN: string;
    SENTRY_DSN: string;
    SENTRY_ORG: string;
    SENTRY_PROJECT: string;
    SENTRY_AUTH_TOKEN: string;
    NEXT_PUBLIC_SENTRY_RELEASE?: string;
    SENTRY_RELEASE?: string;
    
    // Database
    DATABASE_URL: string;
    REDIS_URL?: string;
    MONGODB_URI?: string;
    
    // Auth
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
    
    // API Keys
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    
    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
    NEXT_PUBLIC_ENABLE_SENTRY?: string;
    
    // Other
    ALLOWED_ORIGINS?: string;
    ANALYZE?: string;
  }
}

// Extend the Window interface for client-side globals
interface Window {
  // Analytics
  gtag?: (...args: any[]) => void;
  // Sentry
  __SENTRY__?: any;
  // Custom globals
  __APP_VERSION__?: string;
  __APP_BUILD_TIME__?: string;
}