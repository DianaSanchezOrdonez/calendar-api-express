export const swaggerDoc = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Calendar API',
    description: 'Calendar API for creating event',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  host:
    process.env.NODE_ENV === 'development'
      ? 'localhost:3000'
      : 'calendar-api-express.herokuapp.com',
  basePath: '/',
  paths: {
    '/auth': {
      get: {
        tags: ['Auth'],
        summary: 'Get screen of auth',
        operationId: 'getEvent',
        responses: {
          '200': {
            description: 'Authentication URL',
          },
        },
      },
    },
    '/auth/encode': {
      post: {
        tags: ['Auth'],
        summary: 'Encode claimer and event data',
        operationId: 'postEncode',
        parameters: [
          {
            name: 'Encode',
            in: 'body',
            description:
              'body of event and claimer info that need to be encoded',
            required: true,
            schema: { $ref: '#/definitions/Encode' },
          },
        ],
        responses: {
          '200': {
            description: 'Hash',
          },
        },
      },
    },
    '/auth/decode': {
      get: {
        tags: ['Auth'],
        summary: 'Decode hash',
        operationId: 'getDecode',
        parameters: [
          {
            name: 'hash',
            in: 'query',
            description: 'Decode data by hash',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          '200': {
            description: 'Hash',
            schema: { $ref: '#/definitions/Encode' },
          },
        },
      },
    },
    '/event': {
      post: {
        tags: ['Events'],
        summary: 'Create new Event',
        operationId: 'postEvent',
        parameters: [
          {
            name: 'Event',
            in: 'body',
            description: 'body of event that needs to be created',
            required: true,
            schema: { $ref: '#/definitions/Event' },
          },
        ],
        responses: {
          '200': {
            description: 'Event created',
          },
        },
      },
    },
    '/event/{userId}': {
      get: {
        tags: ['Events'],
        summary: 'Get a event by userId',
        operationId: 'getEvent',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            description: 'ID of event that needs to be got',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: "A list of user's events",
          },
        },
      },
    },
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/xml', 'application/json'],
  definitions: {
    Encode: {
      type: 'object',
      required: ['email', 'event', 'duration'],
      properties: {
        claimerEmail: {
          type: 'string',
        },
        eventName: {
          type: 'string',
        },
        duration: {
          type: 'string',
        },
      },
    },
    Event: {
      type: 'object',
      required: [
        'calendarId',
        'summary',
        'candidateEmail',
        'startDatetime',
        'endDatetime',
      ],
      properties: {
        calendarId: {
          type: 'string',
        },
        summary: {
          type: 'string',
        },
        candidateEmail: {
          type: 'string',
        },
        startDatetime: {
          type: 'string',
          format: 'date-time',
        },
        endDatetime: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  },
}
