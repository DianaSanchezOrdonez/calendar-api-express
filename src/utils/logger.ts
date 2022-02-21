import { createLogger, format, transports } from 'winston'

const myFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)

export const logger = createLogger({
  transports: [
    new transports.Console({
      format: myFormat,
    }),
  ],
})
