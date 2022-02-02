declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      NODE_ENV: string
      GOOGLE_APPLICATION_CREDENTIALS: string
      LOGGER_NAME: string
      REFRESH_TOKEN: string
      CLIENT_SECRET: string
      REDIRECT_URL: string
    }
  }
}

export {}
