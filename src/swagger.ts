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
  host: process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'calendar-api-express.herokuapp.com',
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
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
}
