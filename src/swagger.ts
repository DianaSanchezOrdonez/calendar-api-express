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
            name: 'body',
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
            name: 'body',
            in: 'body',
            description: 'body of event that needs to be created',
            required: true,
            schema: {
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
        ],
        responses: {
          '200': {
            description: 'Event created',
            schema: { $ref: '#/definitions/EventCreated' },
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
            schema: { $ref: '#/definitions/Events' },
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
    Events: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/definitions/Event' },
            },
          },
        },
      },
    },
    Event: {
      type: 'object',
      properties: {
        start: {
          type: 'object',
          properties: {
            dateTime: {
              type: 'string',
              format: 'date-time',
            },
            timeZone: {
              type: 'string',
            },
          },
        },
        end: {
          type: 'object',
          properties: {
            dateTime: {
              type: 'string',
              format: 'date-time',
            },
            timeZone: {
              type: 'string',
            },
          },
        },
      },
    },
    EventCreated: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            start: {
              type: 'object',
              properties: {
                dateTime: {
                  type: 'string',
                  format: 'date-time',
                },
                timeZone: {
                  type: 'string',
                },
              },
            },
            end: {
              type: 'object',
              properties: {
                dateTime: {
                  type: 'string',
                  format: 'date-time',
                },
                timeZone: {
                  type: 'string',
                },
              },
            },
            hangoutLink: {
              type: 'string',
            },
          },
        },
      },
    },
  },
}
