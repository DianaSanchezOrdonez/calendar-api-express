import { google } from 'googleapis'
import { validateCredentials } from 'parse-google-env-credentials'

const keys = validateCredentials()

export const googleConfig = {
  clientId: keys.client_id,
  clientSecret: process.env.CLIENT_SECRET,
  redirect: process.env.REDIRECT_URL,
}

export const oauth2Client = new google.auth.OAuth2({
  clientId: googleConfig.clientId,
  clientSecret: googleConfig.clientSecret,
  redirectUri: googleConfig.redirect,
})
