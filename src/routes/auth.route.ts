import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { generateAuthLink, signUp } from '../controllers/auth.controller'

const router = Router()

export function authRoutes(): Router {
  router.route('/create-auth-link').get(generateAuthLink)
  router.route('/sign-up').post(asyncHandler(signUp))

  return router
}
