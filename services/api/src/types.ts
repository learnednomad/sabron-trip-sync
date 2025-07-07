import type { Context } from 'hono';

// Define the context variables that our middleware sets
export interface Variables {
  userId: string;
  sentry?: any;
}

// Create a typed context that includes our variables
export type AppContext = Context<{ Variables: Variables }>;