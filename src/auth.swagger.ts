export const getAuth = {
  tags: ['Auth'],
  summary: 'Get screen of auth',
  operationId: 'getEvent',
  responses: {
    '200': {
      description: 'Authentication URL',
      headers: {
        'Access-Control-Allow-Origin': {
          type: 'string',
        },
      },
    },
  },
}
