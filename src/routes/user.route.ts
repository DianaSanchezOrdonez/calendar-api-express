import { Router } from 'express'
import AsyncRouter from 'express-promise-router'
import { getUser } from '../controllers/user.controller'

const router: Router = AsyncRouter()

router.route('/validate-user').get(getUser)

export { router }
