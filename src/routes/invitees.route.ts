import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { getInvitee } from '../controllers/invitees.controller'

const router = Router()

export function inviteesRoutes(): Router {
  router.route('/').get(asyncHandler(getInvitee))

  return router
}
