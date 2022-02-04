import { getAuth } from './auth.swagger'
import { getEvent, postEvent } from './events.swagger'

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
  host: 'localhost:3000',
  basePath: '/',
  paths: {
    '/auth': {
      get: getAuth,
    },
    '/event': {
      post: postEvent,
    },
    '/event/{userId}': {
      get: getEvent,
    },
  },
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
}
