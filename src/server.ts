import express, {
  json,
  Application,
  NextFunction,
  Request,
  Response,
} from 'express'
import cors from 'cors'
import { HttpError } from 'http-errors'
import swaggerUi from 'swagger-ui-express'
import { swaggerDoc } from './swagger'
import { router } from './router'
import { plainToClass } from 'class-transformer'
import { HttpErrorDto } from './dtos/http-error.dto'

const app: Application = express()
const PORT = process.env.PORT || 3000
const ENVIROMENT = process.env.NODE_ENV || 'development'

// Middleware
app.use(cors())
app.use(json())

function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (ENVIROMENT !== 'development') {
    console.error(err.message)
    console.error(err.stack || '')
  }

  res.status(err.status ?? 500)
  res.json(plainToClass(HttpErrorDto, err))
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use('/', router(app))
app.use(errorHandler)

app.listen(PORT, async () => {
  console.log(`Server listening on port %d, env: %s`, PORT, ENVIROMENT)
})
