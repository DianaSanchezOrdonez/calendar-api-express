import { Router } from 'express'
import AsyncRouter from 'express-promise-router'
import { getAuthCode, googleAuth } from '../controllers/auth.controller'

const router: Router = AsyncRouter()

router.route('/').get(googleAuth)
router.route('/google/callback').get(getAuthCode)

export { router }
