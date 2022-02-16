import express, {
  json,
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express'
import AsyncRouter from 'express-promise-router'
import cors from 'cors'
import { HttpError } from 'http-errors'
import { router as userRouter } from './routes/user.route'
import { router as eventRouter } from './routes/events.route'
import { router as authRouter } from './routes/auth.route'
import { router as calendarRouter } from './routes/user.route'
import swaggerUi from 'swagger-ui-express'
import { swaggerDoc } from './swagger'
import { googleLogin } from './controllers/auth.controller'
import { getListUserEvents } from './services/events.service'
import morgan from 'morgan'

const app: Application = express()

function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(err.status ?? 500)
  res.json(err)
}

// Middleware
app.use(morgan('dev'))
app.use(cors())
app.use(json())
// app.use(cookieParser())

// Routes
app.use('/', authRouter)

app.use('/users', userRouter)

app.use('/events', eventRouter)

// router.use('/google-login', googleLogin)

// app.get('/protected', checkAuthenticated, (req, res) => {
//   res.send('This route is protected')
// })

// app.use('/protected/calendar', calendarRouter)

// app.use('/protected/event', eventRouter)

// app.get('/logout', (req, res) => {
//   res.clearCookie('session-token')
//   res.redirect('/auth')
// })

app.use(errorHandler)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

export { app }
