import { Router } from 'express'
import {
  getUserCalendar,
  getShareableLink,
} from '../controllers/calendar.controller'
import asyncHandler from 'express-async-handler'

const router: Router = Router()

router.route('/').post(asyncHandler(getUserCalendar))
router.route('/:calendarId').post(asyncHandler(getShareableLink))

// router
//   .route('/:commentId')
//   .get(asyncHandler(getComment))
//   .patch(asyncHandler(updateComment))
//   .delete(asyncHandler(deleteComment));

export { router }
