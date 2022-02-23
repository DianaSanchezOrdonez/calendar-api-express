import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { getUser } from '../controllers/users.controller'

const router = Router()

export function usersRoutes(): Router {
  router.route('/validate-user').get(asyncHandler(getUser))

  return router
}
