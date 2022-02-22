import { Router } from 'express'
import { authRoutes } from './routes/auth.route'
import { eventTypesRoutes } from './routes/events-type.route'
import { eventsRoutes } from './routes/events.route'
import { linksRoutes } from './routes/links.route'
import { usersRoutes } from './routes/user.route'

const expressRouter = Router()

export function router(app: Router): Router {
  app.use('/api/v1/auth', authRoutes())
  app.use('/api/v1/users', usersRoutes())
  app.use('/api/v1/events', eventsRoutes())
  app.use('/api/v1/events-types', eventTypesRoutes())
  app.use('/api/v1/links', linksRoutes())

  return expressRouter
}
