import { createLogger, format, transports } from 'winston'
// [winston] Attempt to write logs with no transports {"message":"Hello again distributed logs","level":"error"}
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

// logger.configure({
//   level: 'error',
//   transports: [
//       new transports.Console()
//   ]
// });
