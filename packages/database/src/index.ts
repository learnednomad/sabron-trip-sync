import { createClient } from '@supabase/supabase-js';

import type { Database } from './types';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client factory function
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY)');
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

// Create Supabase client instance (lazy initialization)
let _supabase: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_, prop) {
    if (!_supabase) {
      _supabase = createSupabaseClient();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_supabase as any)[prop as string];
  }
});

// Export types
export type { Database, Json } from './types';