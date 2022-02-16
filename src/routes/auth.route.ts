import { Router } from 'express'
import AsyncRouter from 'express-promise-router'
import {
  encodeData,
  decodeData,
  generateAuthLink,
  createNewUser
} from '../controllers/auth.controller'

const router: Router = AsyncRouter()

router.route('/create-auth-link').get(generateAuthLink)
router.route('/sign-up').post(createNewUser)
router.route('/encode').post(encodeData)
router.route('/decode').post(decodeData)

export { router }
