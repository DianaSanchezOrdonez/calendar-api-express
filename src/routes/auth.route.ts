import { Router } from 'express'
import AsyncRouter from 'express-promise-router'
import {
  getAuthCode,
  googleAuth,
  encodeData,
  decodeData,
} from '../controllers/auth.controller'

const router: Router = AsyncRouter()

router.route('/').get(googleAuth)
router.route('/google/callback').get(getAuthCode)
router.route('/encode').post(encodeData)
router.route('/decode').get(decodeData)

export { router }
