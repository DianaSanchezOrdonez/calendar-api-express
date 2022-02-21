import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import {
  getBusyEventsSlots,
  addNewEvent,
} from '../controllers/events.controller'

const router = Router()

export function eventsRoutes(): Router {
  router.route('/').get(asyncHandler(getBusyEventsSlots))
  router.route('/').post(asyncHandler(addNewEvent))

  return router
}
