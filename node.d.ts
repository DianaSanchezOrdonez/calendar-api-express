declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      NODE_ENV: string
      OAUTH_CLIENT_ID: string
      CLIENT_SECRET: string
      REDIRECT_URL: string
      CRYPTO_KEY: string
      FRONTEND_LINK: string
      LOCAL_URL: string
    }
  }
}

export {}
