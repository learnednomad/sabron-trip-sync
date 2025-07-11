import { Hono } from 'hono';
import type { Variables } from './types';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { prisma, dualWriteManager, prismaBackup, SyncVerifier } from '@sabron/database';
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
import { rateLimiter } from './middleware/rate-limiter';
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
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  redisUrl: process.env.REDIS_URL,
}));

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

// Database sync health check
app.get('/health/database', async (c) => {
  const syncVerifier = new SyncVerifier(prisma, prismaBackup);
  
  try {
    const healthCheck = await syncVerifier.performHealthCheck();
    const syncStatus = await syncVerifier.verifySyncStatus();
    
    return c.json({
      databases: {
        primary: {
          healthy: healthCheck.primary.healthy,
          latency: `${healthCheck.latency.primary}ms`,
          error: healthCheck.primary.error,
        },
        backup: {
          healthy: healthCheck.backup.healthy,
          latency: `${healthCheck.latency.backup}ms`,
          error: healthCheck.backup.error,
        },
      },
      sync: {
        overall: syncStatus.overall,
        totalTables: syncStatus.reports.length,
        inSync: syncStatus.reports.filter(r => r.inSync).length,
        outOfSync: syncStatus.reports.filter(r => !r.inSync).length,
        errors: syncStatus.errors.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({
      error: 'Failed to check database health',
      message: error.message,
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
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );

    const data = c.req.valid('json');
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
      },
    });

    if (error) {
      return c.json(
        { success: false, error: { code: 'AUTH_FAILED', message: error.message } },
        400
      );
    }

    const userData = {
      id: authData.user!.id,
      email: data.email,
      name: data.name,
      username: data.username,
    };

    const result = await dualWriteManager.create('user', userData);
    
    if (!result.primarySuccess) {
      throw new Error('Failed to create user in primary database');
    }
    
    if (!result.backupSuccess && result.errors.backup) {
      console.error('User creation failed in backup database:', result.errors.backup);
    }

    return c.json({
      success: true,
      data: {
        accessToken: authData.session?.access_token,
        refreshToken: authData.session?.refresh_token,
        user: authData.user,
      },
    }, 201);
  }
);

// Protected routes
const protectedRoutes = new Hono<{ Variables: Variables }>().use('*', authMiddleware());

// Itineraries
protectedRoutes.get('/itineraries', async (c) => {
  const itineraries = await prisma.itinerary.findMany({
    where: { userId: c.get('userId') },
    take: 20,
    orderBy: { updatedAt: 'desc' },
  });
  return c.json({
    success: true,
    items: itineraries,
    pagination: {
      page: 1,
      limit: 20,
      total: itineraries.length,
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
      userId: c.get('userId'),
      title: data.title,
      description: data.description,
      destinations: data.destinations,
      startDate: new Date(data.dateRange.start),
      endDate: new Date(data.dateRange.end),
      duration: Math.ceil(
        (new Date(data.dateRange.end).getTime() - new Date(data.dateRange.start).getTime()) /
        (1000 * 60 * 60 * 24)
      ),
      status: data.status,
      visibility: data.visibility,
      tags: data.tags,
      budget: data.budget,
      notes: data.notes,
      sharing: data.sharing,
      isTemplate: data.isTemplate,
      templateCategory: data.templateCategory,
    };

    const result = await dualWriteManager.create('itinerary', itineraryData);
    
    if (!result.primarySuccess) {
      throw new Error('Failed to create itinerary');
    }

    if (!result.backupSuccess && result.errors.backup) {
      console.error('Itinerary creation failed in backup database:', result.errors.backup);
    }

    const itinerary = result.primaryResult;
    return c.json({ success: true, data: itinerary }, 201);
  }
);

protectedRoutes.get('/itineraries/:id', async (c) => {
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: c.req.param('id'), userId: c.get('userId') },
  });
  if (!itinerary) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Itinerary not found' } }, 404);
  }
  return c.json({ success: true, data: itinerary });
});

protectedRoutes.patch(
  '/itineraries/:id',
  zValidator('json', UpdateItinerarySchema),
  async (c) => {
    const data = c.req.valid('json');
    const itinerary = await prisma.itinerary.update({
      where: { id: c.req.param('id'), userId: c.get('userId') },
      data: {
        title: data.title,
        description: data.description,
        destinations: data.destinations,
        startDate: data.dateRange?.start ? new Date(data.dateRange.start) : undefined,
        endDate: data.dateRange?.end ? new Date(data.dateRange.end) : undefined,
        duration: data.dateRange
          ? Math.ceil(
              (new Date(data.dateRange.end).getTime() - new Date(data.dateRange.start).getTime()) /
              (1000 * 60 * 60 * 24)
            )
          : undefined,
        status: data.status,
        visibility: data.visibility,
        tags: data.tags,
        budget: data.budget,
        notes: data.notes,
        sharing: data.sharing,
        isTemplate: data.isTemplate,
        templateCategory: data.templateCategory,
      },
    });
    return c.json({ success: true, data: itinerary });
  }
);

// Activities
protectedRoutes.get('/itineraries/:itineraryId/activities', async (c) => {
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: c.req.param('itineraryId'), userId: c.get('userId') },
  });
  if (!itinerary) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Itinerary not found' } }, 404);
  }
  const activities = await prisma.activity.findMany({
    where: { itineraryId: c.req.param('itineraryId') },
    take: 20,
    orderBy: { startTime: 'asc' },
  });
  return c.json({
    success: true,
    items: activities,
    pagination: {
      page: 1,
      limit: 20,
      total: activities.length,
      totalPages: 1,
      hasMore: false,
    },
  });
});

protectedRoutes.post(
  '/itineraries/:itineraryId/activities',
  zValidator('json', CreateActivitySchema),
  async (c) => {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: c.req.param('itineraryId'), userId: c.get('userId') },
    });
    if (!itinerary) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Itinerary not found' } }, 404);
    }
    const data = c.req.valid('json');
    const activity = await prisma.activity.create({
      data: {
        itineraryId: itinerary.id,
        title: data.title,
        description: data.description,
        location: data.location,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        duration: Math.floor(
          (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60)
        ),
        category: data.category,
        subcategory: data.subcategory,
        status: data.status,
        priority: data.priority,
        bookingInfo: data.bookingInfo,
        cost: data.cost,
        participants: data.participants,
        notes: data.notes,
        tags: data.tags,
        images: data.images,
        attachments: data.attachments,
        weather: data.weather,
        transportation: data.transportation,
        accessibility: data.accessibility,
        reminders: data.reminders,
        isRecurring: data.isRecurring,
        recurringPattern: data.recurringPattern,
        createdBy: c.get('userId'),
        lastModifiedBy: c.get('userId'),
        linkedActivities: data.linkedActivities || [],
      },
    });
    return c.json({ success: true, data: activity }, 201);
  }
);

protectedRoutes.patch(
  '/activities/:id',
  zValidator('json', UpdateActivitySchema),
  async (c) => {
    const activity = await prisma.activity.findFirst({
      where: { id: c.req.param('id'), itinerary: { userId: c.get('userId') } },
    });
    if (!activity) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } }, 404);
    }
    const data = c.req.valid('json');
    const updatedActivity = await prisma.activity.update({
      where: { id: c.req.param('id') },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        duration: data.startTime && data.endTime
          ? Math.floor(
              (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60)
            )
          : undefined,
        category: data.category,
        subcategory: data.subcategory,
        status: data.status,
        priority: data.priority,
        bookingInfo: data.bookingInfo,
        cost: data.cost,
        participants: data.participants,
        notes: data.notes,
        tags: data.tags,
        images: data.images,
        attachments: data.attachments,
        weather: data.weather,
        transportation: data.transportation,
        accessibility: data.accessibility,
        reminders: data.reminders,
        isRecurring: data.isRecurring,
        recurringPattern: data.recurringPattern,
        lastModifiedBy: c.get('userId'),
        linkedActivities: data.linkedActivities,
      },
    });
    return c.json({ success: true, data: updatedActivity });
  }
);

// Travel Log Entries (inspired by travel-log-github-project-creator)
protectedRoutes.get('/travel-logs', async (c) => {
  const travelLogs = await prisma.travelLogEntry.findMany({
    where: { 
      userId: c.get('userId'),
      publiclyVisible: true
    },
    include: {
      activity: {
        select: {
          id: true,
          title: true,
          locationName: true,
          latitude: true,
          longitude: true
        }
      }
    },
    take: 20,
    orderBy: { visitDate: 'desc' },
  });
  
  return c.json({
    success: true,
    items: travelLogs,
    pagination: {
      page: 1,
      limit: 20,
      total: travelLogs.length,
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

  const where: any = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { address: { contains: query, mode: 'insensitive' } },
      { city: { contains: query, mode: 'insensitive' } }
    ]
  };

  if (country) {
    where.country = { equals: country, mode: 'insensitive' };
  }

  const locations = await prisma.location.findMany({
    where,
    take: limit,
    orderBy: [
      { totalVisits: 'desc' },
      { averageRating: 'desc' }
    ]
  });

  return c.json({
    success: true,
    items: locations,
  });
});

// Bookings
protectedRoutes.post(
  '/bookings',
  zValidator('json', CreateBookingSchema),
  async (c) => {
    const data = c.req.valid('json');
    const booking = await prisma.booking.create({
      data: {
        userId: c.get('userId'),
        type: data.type,
        status: data.status,
        referenceNumber: data.referenceNumber || crypto.randomUUID(),
        provider: data.provider,
        details: {}, // Empty object for details - can be expanded later
        travelers: data.travelers,
        pricing: data.pricing,
        payment: data.payment,
        policies: data.policies,
        documents: data.documents,
        timeline: {}, // Empty object for timeline - can be expanded later
        contact: data.contact,
        notes: data.notes,
        metadata: data.metadata as any || {},
      },
    });
    return c.json({ success: true, data: booking }, 201);
  }
);

app.route('/auth', auth);
app.route('/', protectedRoutes);

const port = parseInt(process.env.PORT || '3000');
serve({ fetch: app.fetch, port });
console.log(`Server running on port ${port}`);

