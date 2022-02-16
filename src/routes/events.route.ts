import { Router } from 'express'
import AsyncRouter from 'express-promise-router'
import {
  getBusyEventsSlots,
  addNewEvent,
} from '../controllers/events.controller'

const router: Router = AsyncRouter()

router.route('/').get(getBusyEventsSlots)
router.route('/').post(addNewEvent)

export { router }
