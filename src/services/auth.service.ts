import { CronJob } from 'cron'
import { defaultScope } from '../helpers/google-jwt.helper'
import { googleConfig, oauth2Client } from '../helpers/google-oauth.helper'
import { AES, enc } from 'crypto-js'
import { DecodeDataResponse } from '../dtos/responses/decode-data.dto'
import { plainToClass } from 'class-transformer'
import { EncodeDataDto } from '../dtos/requests/endode-data.dto'
import { HashDataDto } from '../dtos/requests/hash-data.dto'
import axios from 'axios'
import { logger } from '../helpers/logger.helper'
import createError from 'http-errors'

const convertArrayScopeToString = (scope: Array<string>): string => {
  const stringScope = scope.toString().replace(/[,]/g, '+')

  return stringScope
}

export const generateAuthUrl = async (): Promise<string> => {
  try {
    const stringScope = convertArrayScopeToString(defaultScope)

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.OAUTH_CLIENT_ID}&response_type=code&scope=${stringScope}&redirect_uri=${process.env.REDIRECT_URL}&prompt=consent&include_granted_scopes=true&access_type=offline`
  } catch (e: any) {
    logger.error(e.message)
    throw createError(422, {
      level: 'generateAuthUrl',
      message: e.message,
    })
  }
}

// https://developers.google.com/identity/protocols/oauth2/web-server#incrementalAuth
export const refreshToken = async (code: string): Promise<void> => {
  const { tokens } = await oauth2Client.getToken(code)

  return oauth2Client.setCredentials(tokens)
}

const job = new CronJob(
  '0 */45 * * * *',
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
      logger.error(e.message)
      throw createError(422, {
        level: 'refreshToken',
        message: e.message,
      })
    }

    logger.info('You will see this message every 45 min')
  },
  null,
  true,
  'UTC'
)
job.start()

export const encodeEventData = async (
  input: EncodeDataDto
): Promise<string> => {
  await input.isValid()
  while (true) {
    const hash = AES.encrypt(
      JSON.stringify({
        claimerEmail: input.claimerEmail,
        candidateEmail: input.candidateEmail,
        eventName: input.eventName,
        duration: input.duration,
      }),
      process.env.CRYPTO_KEY
    ).toString()
    if (!hash.includes('+')) {
      console.log(hash)

      break
    }

    return `${process.env.FRONTEND_LINK}?hash=${hash}`
  }
}

export const decodeEventData = async (
  input: HashDataDto
): Promise<DecodeDataResponse> => {
  await input.isValid()
  try {
    const data = AES.decrypt(input.hash, process.env.CRYPTO_KEY).toString(
      enc.Utf8
    )

    return plainToClass(DecodeDataResponse, JSON.parse(data))
  } catch (e: any) {
    logger.error(e.message)
    throw createError(422, {
      level: 'decodeEventData',
      message: e.message,
    })
  }
}

// https://console.cloud.google.com/apis/credentials/oauthclient/30493417252-ajuf1j1kn1rt0c9jcoqrbj39pgu2rhng.apps.googleusercontent.com?orgonly=true&project=nestjsnbblapi&supportedpurview=organizationId
// https://developers.google.com/oauthplayground/
// https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1
// https://cloud.google.com/apigee/docs/api-platform/security/oauth/access-tokens
