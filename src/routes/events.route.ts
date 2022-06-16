import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import {
  getBusyEventsSlots,
  addNewEvent,
  watchEvent,
  stopWatchEvent
} from '../controllers/events.controller'

const router = Router()

export function eventsRoutes(): Router {
  router.route('/').get(asyncHandler(getBusyEventsSlots))
  router.route('/').post(asyncHandler(addNewEvent))
  router.route('/watch').get(asyncHandler(watchEvent))
  router.route('/stop').get(asyncHandler(stopWatchEvent))

  return router
}
