import { Router } from 'express'
import AsyncRouter from 'express-promise-router'
import {
  getUserCalendar,
  getShareableLink,
} from '../controllers/calendar.controller'

const router: Router = AsyncRouter()

router.route('/').post(getUserCalendar)
router.route('/:calendarId').post(getShareableLink)

// router
//   .route('/:commentId')
//   .get(asyncHandler(getComment))
//   .patch(asyncHandler(updateComment))
//   .delete(asyncHandler(deleteComment));

export { router }
