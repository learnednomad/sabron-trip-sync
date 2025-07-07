import type { OpenAPIObject } from 'openapi3-ts/oas30';

export const openApiSpec: OpenAPIObject = {
  openapi: '3.0.3',
  info: {
    title: 'Sabron Trip Sync API',
    description: 'API for managing travel itineraries, activities, and bookings',
    version: '1.0.0',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { status: { type: 'string' } } },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'User login',
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Login' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful login',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                        user: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'User registration',
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Register' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                        user: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Bad request' },
        },
      },
    },
    '/itineraries': {
      get: {
        summary: 'List itineraries',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    items: { type: 'array', items: { $ref: '#/components/schemas/Itinerary' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        summary: 'Create an itinerary',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateItinerary' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Itinerary created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Itinerary' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/itineraries/{id}': {
      get: {
        summary: 'Get an itinerary by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Itinerary' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not found' },
        },
      },
      patch: {
        summary: 'Update an itinerary',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateItinerary' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Itinerary updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Itinerary' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/itineraries/{itineraryId}/activities': {
      get: {
        summary: 'List activities for an itinerary',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'itineraryId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    items: { type: 'array', items: { $ref: '#/components/schemas/Activity' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not found' },
        },
      },
      post: {
        summary: 'Create an activity',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'itineraryId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateActivity' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Activity created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Activity' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/activities/{id}': {
      patch: {
        summary: 'Update an activity',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateActivity' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Activity updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Activity' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/bookings': {
      post: {
        summary: 'Create a booking',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBooking' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Booking created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Booking' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
  components: {
    schemas: {
      Login: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          rememberMe: { type: 'boolean' },
        },
      },
      Register: {
        type: 'object',
        required: ['email', 'password', 'name', 'acceptTerms'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          confirmPassword: { type: 'string' },
          name: { type: 'string' },
          username: { type: 'string' },
          acceptTerms: { type: 'boolean' },
        },
      },
      Itinerary: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          destinations: { type: 'array', items: { type: 'object' } },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['draft', 'planned', 'active', 'completed', 'cancelled'] },
          visibility: { type: 'string', enum: ['public', 'private', 'shared'] },
        },
      },
      CreateItinerary: {
        type: 'object',
        required: ['title', 'destinations', 'dateRange'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          destinations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                country: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: { lat: { type: 'number' }, lng: { type: 'number' } },
                },
                timezone: { type: 'string' },
              },
            },
          },
          dateRange: {
            type: 'object',
            properties: { start: { type: 'string', format: 'date-time' }, end: { type: 'string', format: 'date-time' } },
          },
        },
      },
      UpdateItinerary: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          destinations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                country: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: { lat: { type: 'number' }, lng: { type: 'number' } },
                },
                timezone: { type: 'string' },
              },
            },
          },
          dateRange: {
            type: 'object',
            properties: { start: { type: 'string', format: 'date-time' }, end: { type: 'string', format: 'date-time' } },
          },
        },
      },
      Activity: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          location: { type: 'object' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          category: { type: 'string' },
        },
      },
      CreateActivity: {
        type: 'object',
        required: ['title', 'location', 'startTime', 'endTime', 'category'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          location: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              coordinates: {
                type: 'object',
                properties: { latitude: { type: 'number' }, longitude: { type: 'number' } },
              },
            },
          },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          category: { type: 'string' },
        },
      },
      UpdateActivity: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          location: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              coordinates: {
                type: 'object',
                properties: { latitude: { type: 'number' }, longitude: { type: 'number' } },
              },
            },
          },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          category: { type: 'string' },
        },
      },
      Booking: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' },
          referenceNumber: { type: 'string' },
          provider: { type: 'object' },
          details: { type: 'object' },
          travelers: { type: 'array', items: { type: 'object' } },
        },
      },
      CreateBooking: {
        type: 'object',
        required: ['type', 'travelers', 'pricing'],
        properties: {
          type: { type: 'string' },
          status: { type: 'string' },
          referenceNumber: { type: 'string' },
          provider: { type: 'object' },
          travelers: { type: 'array', items: { type: 'object' } },
          pricing: { type: 'object' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasMore: { type: 'boolean' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

