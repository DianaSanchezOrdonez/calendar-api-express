import { Router } from 'express'
import {
  getAuthCode,
  googleAuth,
} from '../controllers/auth.controller'
import asyncHandler from 'express-async-handler'

const router: Router = Router()

router.route('/').get(asyncHandler(googleAuth))
router.route('/google/callback').get(asyncHandler(getAuthCode))

export { router }
