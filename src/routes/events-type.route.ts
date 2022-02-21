import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { getEventType } from '../controllers/events-type.controller'

const router = Router()

export function eventTypesRoutes(): Router {
  router.route('/').get(asyncHandler(getEventType))

  return router
}
