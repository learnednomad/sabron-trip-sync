import { createClient } from 'redis';
import type { AppContext } from '../types';

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  redisUrl?: string;
}

export function rateLimiter(options: RateLimiterOptions) {
  const { windowMs, max, redisUrl } = options;
  let redis: ReturnType<typeof createClient> | null = null;

  if (redisUrl) {
    redis = createClient({ url: redisUrl });
    redis.connect();
  }

  return async (c: AppContext, next: () => Promise<void>) => {
    const ip = c.req.header('x-forwarded-for') || 'unknown';
    const key = `rate-limit:${ip}`;

    try {
      if (redis) {
        const requests = await redis.get(key) || '0';
        const current = parseInt(requests, 10);

        if (current >= max) {
          return c.json(
            { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
            429
          );
        }

        await redis.multi()
          .incr(key)
          .expire(key, windowMs / 1000)
          .exec();
      }
      return next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      return next();
    }
  };
}
