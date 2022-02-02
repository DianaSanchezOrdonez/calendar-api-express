import express, { Application, NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import morgan from 'morgan'
import { router as eventRouter } from './routes/events.route'
import { router as authRouter } from './routes/auth.route'
import { router as calendarRouter } from './routes/calendar.route'

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
app.use(express.json())

// Routes
app.use('/auth', authRouter)

app.use('/calendar', calendarRouter)

app.use('/event', eventRouter)

app.use(errorHandler)

export { app }
