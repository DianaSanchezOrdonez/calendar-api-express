import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import {
  encodeEventData,
  decodeEventData,
} from '../controllers/links.controller'

const router = Router()

export function linksRoutes(): Router {
  router.route('/encode').post(asyncHandler(encodeEventData))
  router.route('/decode').post(asyncHandler(decodeEventData))

  return router
}
