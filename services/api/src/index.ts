import { Hono } from 'hono';
import type { Variables } from './types';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { bodyLimit } from 'hono/body-limit';
import { logger } from 'hono/logger';
import { zValidator } from '@hono/zod-validator';
import { supabase, type Json } from '@sabron/database';
import {
  CreateItinerarySchema,
  UpdateItinerarySchema,
  CreateActivitySchema,
  UpdateActivitySchema,
  LoginSchema,
  RegisterSchema,
  CreateBookingSchema
} from '@sabron/validation';
import { initSentry } from './sentry';
import { authMiddleware } from './middleware/auth';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapi';
import { createClient } from '@supabase/supabase-js';

initSentry();

const app = new Hono<{ Variables: Variables }>();

app.use('*', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use('*', logger());
app.use('*', bodyLimit({ maxSize: 50 * 1024 * 1024 })); // 50MB limit
// Temporarily disabled rate limiter for debugging
// app.use('*', rateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per window
//   redisUrl: process.env.REDIS_URL,
// }));

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

// Debug endpoint to test JSON parsing
app.post('/debug/json', async (c) => {
  try {
    const body = await c.req.json();
    return c.json({ success: true, received: body });
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'JSON parsing failed', 
      message: error instanceof Error ? error.message : String(error) 
    }, 400);
  }
});

// Debug endpoint to test login without zValidator
app.post('/debug/login', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Raw body received:', body);
    
    if (!body.email || !body.password) {
      return c.json({ success: false, error: 'Email and password required' }, 400);
    }
    
    return c.json({ 
      success: true, 
      message: 'Login data received successfully',
      data: { email: body.email, hasPassword: !!body.password }
    });
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'JSON parsing failed', 
      message: error instanceof Error ? error.message : String(error) 
    }, 400);
  }
});

// Database health check
app.get('/health/database', async (c) => {
  try {
    const start = Date.now();
    const { error } = await supabase.from('users').select('id').limit(1);
    const latency = Date.now() - start;
    
    if (error) throw error;
    
    return c.json({
      database: {
        healthy: true,
        latency: `${latency}ms`,
        provider: 'supabase',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      database: {
        healthy: false,
        error: error instanceof Error ? error.message : String(error),
      },
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// OpenAPI Documentation
app.get('/api-docs', (c) => c.json(openApiSpec));
app.use('/docs', async (c) => {
  return c.html(swaggerUi.generateHTML(openApiSpec));
});

// Auth routes
const auth = new Hono<{ Variables: Variables }>();

app.post(
  '/auth/login',
  zValidator('json', LoginSchema),
  async (c) => {
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );

    const data = c.req.valid('json');
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return c.json(
        { success: false, error: { code: 'AUTH_FAILED', message: error.message } },
        401
      );
    }

    return c.json({
      success: true,
      data: {
        accessToken: authData.session?.access_token,
        refreshToken: authData.session?.refresh_token,
        user: authData.user,
      },
    });
  }
);

app.post(
  '/auth/register',
  zValidator('json', RegisterSchema),
  async (c) => {
    try {
      console.log('Registration attempt started');
      
      const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || ''
      );

      const data = c.req.valid('json');
      console.log('Registration data validated:', { email: data.email, name: data.name });
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
        },
      });

      console.log('Supabase response:', { success: !error, error: error?.message });

      if (error) {
        return c.json(
          { success: false, error: { code: 'AUTH_FAILED', message: error.message } },
          400
        );
      }

      console.log('Registration successful, returning response');
      
      return c.json({
        success: true,
        data: {
          accessToken: authData.session?.access_token,
          refreshToken: authData.session?.refresh_token,
          user: authData.user,
        },
      }, 201);
    } catch (error) {
      console.error('Registration error:', error);
      return c.json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : 'Unknown error' }
      }, 500);
    }
  }
);

// Protected routes
const protectedRoutes = new Hono<{ Variables: Variables }>().use('*', authMiddleware());

// Itineraries
protectedRoutes.get('/itineraries', async (c) => {
  const { data: itineraries, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('user_id', c.get('userId'))
    .order('updated_at', { ascending: false })
    .limit(20);

  if (error) {
    return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, 500);
  }

  return c.json({
    success: true,
    items: itineraries || [],
    pagination: {
      page: 1,
      limit: 20,
      total: itineraries?.length || 0,
      totalPages: 1,
      hasMore: false,
    },
  });
});

protectedRoutes.post(
  '/itineraries',
  zValidator('json', CreateItinerarySchema),
  async (c) => {
    const data = c.req.valid('json');
    const itineraryData = {
      user_id: c.get('userId'),
      title: data.title,
      description: data.description,
      destination: data.destinations[0]?.name || '', // Store first destination name as string
      start_date: data.dateRange.start,
      end_date: data.dateRange.end,
      status: data.status,
      visibility: data.visibility,
      tags: data.tags,
      budget: data.budget?.total?.amount || null, // Store budget amount as number
      currency: data.budget?.currency || 'USD',
      metadata: {
        destinations: data.destinations, // Store full destination data in metadata
        budget: data.budget, // Store full budget data in metadata
        transportation: data.transportation || [],
        accommodations: data.accommodations || [],
        travelers: data.travelers || [],
        sharing: data.sharing || null,
      } as Json,
    };

    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .insert(itineraryData)
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, 500);
    }

    return c.json({ success: true, data: itinerary }, 201);
  }
);

protectedRoutes.get('/itineraries/:id', async (c) => {
  const { data: itinerary, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', c.req.param('id'))
    .eq('user_id', c.get('userId'))
    .single();

  if (error || !itinerary) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Itinerary not found' } }, 404);
  }

  return c.json({ success: true, data: itinerary });
});

protectedRoutes.patch(
  '/itineraries/:id',
  zValidator('json', UpdateItinerarySchema),
  async (c) => {
    const data = c.req.valid('json');
    
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.destinations !== undefined) updateData.destination = data.destinations;
    if (data.dateRange?.start !== undefined) updateData.start_date = data.dateRange.start;
    if (data.dateRange?.end !== undefined) updateData.end_date = data.dateRange.end;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.sharing !== undefined) updateData.sharing = data.sharing;
    if (data.isTemplate !== undefined) updateData.is_template = data.isTemplate;
    if (data.templateCategory !== undefined) updateData.template_category = data.templateCategory;

    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .update(updateData)
      .eq('id', c.req.param('id'))
      .eq('user_id', c.get('userId'))
      .select()
      .single();

    if (error || !itinerary) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Itinerary not found or update failed' } }, 404);
    }

    return c.json({ success: true, data: itinerary });
  }
);

// Activities
protectedRoutes.get('/itineraries/:itineraryId/activities', async (c) => {
  // First check if itinerary exists and belongs to user
  const { data: itinerary, error: itineraryError } = await supabase
    .from('itineraries')
    .select('id')
    .eq('id', c.req.param('itineraryId'))
    .eq('user_id', c.get('userId'))
    .single();

  if (itineraryError || !itinerary) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Itinerary not found' } }, 404);
  }

  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .eq('itinerary_id', c.req.param('itineraryId'))
    .order('start_time', { ascending: true })
    .limit(20);

  if (error) {
    return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, 500);
  }

  return c.json({
    success: true,
    items: activities || [],
    pagination: {
      page: 1,
      limit: 20,
      total: activities?.length || 0,
      totalPages: 1,
      hasMore: false,
    },
  });
});

protectedRoutes.post(
  '/itineraries/:itineraryId/activities',
  zValidator('json', CreateActivitySchema),
  async (c) => {
    // First check if itinerary exists and belongs to user
    const { data: itinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .select('id')
      .eq('id', c.req.param('itineraryId'))
      .eq('user_id', c.get('userId'))
      .single();

    if (itineraryError || !itinerary) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Itinerary not found' } }, 404);
    }

    const data = c.req.valid('json');
    const activityData = {
      itinerary_id: itinerary.id,
      title: data.title,
      description: data.description,
      location: data.location?.name || null,
      address: data.location?.address || null,
      latitude: data.location?.coordinates?.latitude || null,
      longitude: data.location?.coordinates?.longitude || null,
      start_time: data.startTime,
      end_time: data.endTime,
      duration_minutes: Math.floor(
        (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60)
      ),
      category: data.category,
      cost: data.cost?.amount || null,
      currency: data.cost?.currency || null,
      notes: data.notes,
      metadata: {
        subcategory: data.subcategory,
        status: data.status,
        priority: data.priority,
        bookingInfo: data.bookingInfo,
        participants: data.participants,
        tags: data.tags,
        images: data.images,
        attachments: data.attachments,
        weather: data.weather,
        transportation: data.transportation,
        accessibility: data.accessibility,
        reminders: data.reminders,
        isRecurring: data.isRecurring,
        recurringPattern: data.recurringPattern,
        linkedActivities: data.linkedActivities || [],
        fullLocation: data.location, // Store full location data
      } as Json,
    };

    const { data: activity, error } = await supabase
      .from('activities')
      .insert(activityData)
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, 500);
    }

    return c.json({ success: true, data: activity }, 201);
  }
);

protectedRoutes.patch(
  '/activities/:id',
  zValidator('json', UpdateActivitySchema),
  async (c) => {
    // Check if activity exists and user has access (through itinerary ownership)
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id, itinerary_id')
      .eq('id', c.req.param('id'))
      .single();

    if (activityError || !activity) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } }, 404);
    }

    // Verify user owns the itinerary
    const { data: itinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .select('id')
      .eq('id', activity.itinerary_id)
      .eq('user_id', c.get('userId'))
      .single();

    if (itineraryError || !itinerary) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } }, 404);
    }

    const data = c.req.valid('json');
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) {
      updateData.location = data.location?.name || null;
      updateData.address = data.location?.address || null;
      updateData.latitude = data.location?.coordinates?.latitude || null;
      updateData.longitude = data.location?.coordinates?.longitude || null;
    }
    if (data.startTime !== undefined) updateData.start_time = data.startTime;
    if (data.endTime !== undefined) updateData.end_time = data.endTime;
    if (data.startTime !== undefined && data.endTime !== undefined) {
      updateData.duration_minutes = Math.floor(
        (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60)
      );
    }
    if (data.category !== undefined) updateData.category = data.category;
    if (data.cost !== undefined) {
      updateData.cost = data.cost?.amount || null;
      updateData.currency = data.cost?.currency || null;
    }
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    // Store complex data in metadata
    const metadataUpdates: any = {};
    if (data.subcategory !== undefined) metadataUpdates.subcategory = data.subcategory;
    if (data.status !== undefined) metadataUpdates.status = data.status;
    if (data.priority !== undefined) metadataUpdates.priority = data.priority;
    if (data.bookingInfo !== undefined) metadataUpdates.bookingInfo = data.bookingInfo;
    if (data.participants !== undefined) metadataUpdates.participants = data.participants;
    if (data.tags !== undefined) metadataUpdates.tags = data.tags;
    if (data.images !== undefined) metadataUpdates.images = data.images;
    if (data.attachments !== undefined) metadataUpdates.attachments = data.attachments;
    if (data.weather !== undefined) metadataUpdates.weather = data.weather;
    if (data.transportation !== undefined) metadataUpdates.transportation = data.transportation;
    if (data.accessibility !== undefined) metadataUpdates.accessibility = data.accessibility;
    if (data.reminders !== undefined) metadataUpdates.reminders = data.reminders;
    if (data.isRecurring !== undefined) metadataUpdates.isRecurring = data.isRecurring;
    if (data.recurringPattern !== undefined) metadataUpdates.recurringPattern = data.recurringPattern;
    if (data.linkedActivities !== undefined) metadataUpdates.linkedActivities = data.linkedActivities;
    if (data.location !== undefined) metadataUpdates.fullLocation = data.location;
    
    if (Object.keys(metadataUpdates).length > 0) {
      updateData.metadata = metadataUpdates as Json;
    }

    const { data: updatedActivity, error } = await supabase
      .from('activities')
      .update(updateData)
      .eq('id', c.req.param('id'))
      .select()
      .single();

    if (error || !updatedActivity) {
      return c.json({ success: false, error: { code: 'UPDATE_FAILED', message: 'Failed to update activity' } }, 500);
    }

    return c.json({ success: true, data: updatedActivity });
  }
);

// Travel Log Entries (inspired by travel-log-github-project-creator)
protectedRoutes.get('/travel-logs', async (c) => {
  const { data: travelLogs, error } = await supabase
    .from('travel_log_entries')
    .select(`
      *,
      activities (
        id,
        title,
        location_name,
        latitude,
        longitude
      )
    `)
    .eq('user_id', c.get('userId'))
    .eq('publicly_visible', true)
    .order('visit_date', { ascending: false })
    .limit(20);

  if (error) {
    return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, 500);
  }
  
  return c.json({
    success: true,
    items: travelLogs || [],
    pagination: {
      page: 1,
      limit: 20,
      total: travelLogs?.length || 0,
      totalPages: 1,
      hasMore: false,
    },
  });
});

// Locations API (inspired by travel-log location management)
protectedRoutes.get('/locations/search', async (c) => {
  const query = c.req.query('q');
  const country = c.req.query('country');
  const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50);
  
  if (!query) {
    return c.json({ success: false, error: { code: 'MISSING_QUERY', message: 'Search query is required' } }, 400);
  }

  let queryBuilder = supabase
    .from('locations')
    .select('*')
    .eq('is_active', true);

  // Add text search filters
  queryBuilder = queryBuilder.or(`name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`);

  if (country) {
    queryBuilder = queryBuilder.ilike('country', `%${country}%`);
  }

  const { data: locations, error } = await queryBuilder
    .order('total_visits', { ascending: false })
    .order('average_rating', { ascending: false })
    .limit(limit);

  if (error) {
    return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, 500);
  }

  return c.json({
    success: true,
    items: locations || [],
  });
});

// Bookings
protectedRoutes.post(
  '/bookings',
  zValidator('json', CreateBookingSchema),
  async (c) => {
    const data = c.req.valid('json');
    const bookingData = {
      user_id: c.get('userId'),
      type: data.type,
      status: data.status,
      reference_number: data.referenceNumber || crypto.randomUUID(),
      provider: data.provider,
      details: {} as Json, // Empty object for details - can be expanded later
      travelers: data.travelers as Json,
      pricing: data.pricing as Json,
      payment: data.payment as Json,
      policies: data.policies as Json,
      documents: data.documents as Json,
      timeline: {} as Json, // Empty object for timeline - can be expanded later
      contact: data.contact as Json,
      notes: data.notes,
      metadata: (data.metadata || {}) as Json,
    };

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, 500);
    }

    return c.json({ success: true, data: booking }, 201);
  }
);

app.route('/auth', auth);
app.route('/', protectedRoutes);

const port = parseInt(process.env.PORT || '3000');
serve({ fetch: app.fetch, port });
console.log(`Server running on port ${port}`);

