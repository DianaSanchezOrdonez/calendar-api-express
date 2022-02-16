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
      ? `6327-2800-200-f008-bb49-5c3e-391-3161-a4a0.ngrok.io`
      : 'calendar-api-express.herokuapp.com',
  basePath: '/',
  paths: {
    '/create-auth-link': {
      get: {
        tags: ['Auth'],
        summary: 'Get screen of auth',
        operationId: 'generateAuthLink',
        responses: {
          '200': {
            description: 'Authentication URL',
          },
        },
      },
    },
    '/sign-up': {
      post: {
        tags: ['Auth'],
        operationId: 'createNewUser',
        parameters: [
          {
            name: 'code',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['code'],
              properties: {
                code: {
                  type: 'string',
                },
              },
            },
          },
        ],
        responses: {
          '200': {
            description: '',
          },
        },
      },
    },
    '/decode': {
      post: {
        tags: ['Auth'],
        summary: 'Decode hash',
        operationId: 'postDecode',
        parameters: [
          {
            name: 'body',
            in: 'body',
            description: 'Decode data by hash',
            required: true,
            schema: {
              type: 'object',
              properties: {
                hash: {
                  type: 'string',
                },
              },
            },
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
    '/events': {
      post: {
        tags: ['Events'],
        summary: 'Create new Event',
        operationId: 'addNewEvent',
        parameters: [
          {
            name: 'body',
            in: 'body',
            description: 'body of event that needs to be created',
            required: true,
            schema: {
              type: 'object',
              required: [
                'timeZone',
                'eventName',
                'location',
                'description',
                'startDatetime',
                'invitee',
                'inviter',
              ],
              properties: {
                timeZone: {
                  type: 'string',
                },
                eventName: {
                  type: 'string',
                },
                location: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
                startDatetime: {
                  type: 'string',
                  format: 'date-time',
                },
                invitee: {
                  type: 'string',
                },
                inviter: {
                  type: 'string',
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
      get: {
        tags: ['Events'],
        summary: 'Get a event by email',
        operationId: 'getEvent',
        parameters: [
          {
            name: 'email',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'timeZone',
            in: 'query',
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
    '/users/validate-user': {
      get: {
        tags: ['Users'],
        summary: 'Get a user by email',
        operationId: 'getUser',
        parameters: [
          {
            name: 'email',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User data',
            schema: { $ref: '#/definitions/User' },
          },
        },
      },
    },
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  definitions: {
    Encode: {
      type: 'object',
      required: ['claimerEmail', 'candidateEmail', 'event', 'duration'],
      properties: {
        claimerEmail: {
          type: 'string',
        },
        candidateEmail: {
          type: 'string',
        },
        event: {
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
    User: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        uuid: {
          type: 'string',
        },
        fullName: {
          type: 'string',
        },
        email: {
          type: 'number',
        },
        picture: {
          type: 'string',
        },
        refreshToken: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  },
}
