import axios from 'axios'
import { CronJob } from 'cron'
import { defaultScope } from '../helpers/google-jwt.helper'
import { googleConfig, oauth2Client } from '../helpers/google-oauth.helper'
import { CustomError } from '../helpers/handler-error'

export const generateAuthUrl = async (): Promise<string> => {
  try {
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: defaultScope,
    })

    return authorizeUrl
  } catch (e: any) {
    console.error('generateAuthUrl error: ', e)
    throw new CustomError(e.message, 422)
  }
}

// https://developers.google.com/identity/protocols/oauth2/web-server#incrementalAuth
export const refreshToken = async (code: string): Promise<void> => {
  const { tokens } = await oauth2Client.getToken(code)

  return oauth2Client.setCredentials(tokens)
}

const job = new CronJob(
  '0 */30 * * * *',
  async () => {
    try {
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: process.env.REFRESH_TOKEN,
      })
      await oauth2Client.setCredentials(data)
    } catch (e: any) {
      console.error('refreshToken error: ', e)
      throw new CustomError(e.message, 422)
    }

    console.log('You will see this message every 30 min')
  },
  null,
  true,
  'UTC'
)
job.start()

// https://console.cloud.google.com/apis/credentials/oauthclient/30493417252-ajuf1j1kn1rt0c9jcoqrbj39pgu2rhng.apps.googleusercontent.com?orgonly=true&project=nestjsnbblapi&supportedpurview=organizationId
// https://developers.google.com/oauthplayground/
// https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1
// https://cloud.google.com/apigee/docs/api-platform/security/oauth/access-tokens
