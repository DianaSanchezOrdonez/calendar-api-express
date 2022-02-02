import { Router } from 'express'
import {
  createNewEvent,
  getListEventsByUser,
} from '../controllers/events.controller'
import asyncHandler from 'express-async-handler'

const router: Router = Router()

router.route('/').post(asyncHandler(createNewEvent))

router.route('/:userId').get(asyncHandler(getListEventsByUser))

// router
//   .route('/:commentId')
//   .get(asyncHandler(getComment))
//   .patch(asyncHandler(updateComment))
//   .delete(asyncHandler(deleteComment));

export { router }
