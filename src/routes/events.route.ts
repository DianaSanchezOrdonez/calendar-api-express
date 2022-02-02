import { Router } from 'express'
import AsyncRouter from 'express-promise-router'
import {
  createNewEvent,
  getListEventsByUser,
} from '../controllers/events.controller'

const router: Router = AsyncRouter()

router.route('/').post(createNewEvent)

router.route('/:userId').get(getListEventsByUser)

// router
//   .route('/:commentId')
//   .get(asyncHandler(getComment))
//   .patch(asyncHandler(updateComment))
//   .delete(asyncHandler(deleteComment));

export { router }
