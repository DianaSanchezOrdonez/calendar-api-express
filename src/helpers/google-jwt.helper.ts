import { google } from 'googleapis'
import { validateCredentials } from 'parse-google-env-credentials'

const keys = validateCredentials()

export const defaultScope = [
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
]

export const impersonatingAuth = new google.auth.JWT({
  email: keys.client_email,
  key: keys.private_key,
  keyId: keys.private_key_id,
  scopes: defaultScope,
})
