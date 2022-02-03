import { google } from 'googleapis'

export const googleConfig = {
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirect: process.env.REDIRECT_URL,
}

export const oauth2Client = new google.auth.OAuth2({
  clientId: googleConfig.clientId,
  clientSecret: googleConfig.clientSecret,
  redirectUri: googleConfig.redirect,
})
