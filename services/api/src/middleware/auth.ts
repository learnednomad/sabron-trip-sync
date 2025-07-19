import { createClient } from '@supabase/supabase-js';
import type { AppContext } from '../types';

export function authMiddleware() {
  return async (c: AppContext, next: () => Promise<void>) => {
    // Create a Supabase client with service key for auth verification
    // Note: We use service key here for server-side auth verification
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    );

    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' } },
        401
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return c.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } },
        401
      );
    }

    c.set('userId', data.user.id);
    return next();
  };
}
