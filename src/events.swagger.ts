export const getEvent = {
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
      headers: {
        'Access-Control-Allow-Origin': {
          type: 'string',
        },
      },
    },
  },
}

export const postEvent = {
  tags: ['Events'],
  summary: 'Create new Event',
  operationId: 'postEvent',
  parameters: [
    {
      name: 'event',
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
          },
          endDatetime: {
            type: 'string',
          },
        },
      },
    },
  ],
  responses: {
    '200': {
      description: 'Event created',
      headers: {
        'Access-Control-Allow-Origin': {
          type: 'string',
        },
      },
    },
  },
}
