import 'react-native-url-polyfill/auto';

import { Env } from '@env';
import { createClient } from '@supabase/supabase-js';

import { supabaseSecureStorage } from './secure-storage';

const supabaseUrl = Env.SUPABASE_URL;
const supabaseAnonKey = Env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseSecureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
