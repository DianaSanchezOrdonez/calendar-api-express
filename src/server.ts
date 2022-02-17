import express, {
  json,
  Application,
  NextFunction,
  Request,
  Response,
} from 'express'
import cors from 'cors'
import { HttpError } from 'http-errors'
import { router as userRouter } from './routes/user.route'
import { router as eventRouter } from './routes/events.route'
import { router as authRouter } from './routes/auth.route'
import swaggerUi from 'swagger-ui-express'
import { swaggerDoc } from './swagger'
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

// Routes
app.use('/', authRouter)

app.use('/users', userRouter)

app.use('/events', eventRouter)

app.use(errorHandler)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

export { app }
