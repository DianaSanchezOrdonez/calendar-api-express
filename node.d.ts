declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      NODE_ENV: string
      GOOGLE_APPLICATION_CREDENTIALS: string
      LOGGER_NAME: string
      REFRESH_TOKEN: string
      OAUTH_CLIENT_ID: string
      CLIENT_SECRET: string
      REDIRECT_URL: string
      CRYPTO_KEY: string
      FRONTEND_LINK: string
      INITIAL_INTERVIEW_ID: string
      CHALLENGE_INTERVIEW_ID: string
      FINAL_INTERVIEW_ID: string
    }
  }
}

export {}
