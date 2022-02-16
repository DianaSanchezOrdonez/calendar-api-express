import { google } from 'googleapis'
import { AES, enc } from 'crypto-js'
import { plainToClass } from 'class-transformer'
import { UnprocessableEntity } from 'http-errors'
import { DecodeDataResponse } from '../dtos/responses/decode-data.dto'
import { EncodeDataDto } from '../dtos/requests/endode-data.dto'
import { HashDataDto } from '../dtos/requests/hash-data.dto'
import { logger } from '../helpers/logger.helper'
import { createNewUser } from './users.service'
import { googleConfig, oAuth2Client } from '../helpers/google-oauth.helper'
import jwt from 'jsonwebtoken'

export const createAuthLink = (): string => {
  try {
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      include_granted_scopes: true,
      response_type: 'code',
      scope: googleConfig.scope,
      prompt: 'consent',
    })

    return url
  } catch (e: any) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

export const addNewUser = async (input: { code: string }) => {
  try {
    const { tokens } = await oAuth2Client.getToken(input.code)
    console.log('tokens', tokens)

    const testDecoded = jwt.decode(tokens.id_token)
    console.log('testDecoded', testDecoded)

    // const ticket = await oAuth2Client.verifyIdToken({
    //   idToken: tokens.id_token,
    //   audience: process.env.CLIENT_ID,
    // })

    // const { name, email, picture } = ticket.getPayload()
    if (typeof testDecoded !== 'string') {
      return createNewUser({
        fullName: testDecoded.name,
        email: testDecoded.email,
        picture: testDecoded.picture,
        refreshToken: tokens.refresh_token,
      })
    }

    
  } catch (e: any) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

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
    throw new UnprocessableEntity(e.message)
  }
}

// https://developers.google.com/identity/protocols/oauth2/web-server#incrementalAuth
// https://console.cloud.google.com/apis/credentials/oauthclient/30493417252-ajuf1j1kn1rt0c9jcoqrbj39pgu2rhng.apps.googleusercontent.com?orgonly=true&project=nestjsnbblapi&supportedpurview=organizationId
// https://developers.google.com/oauthplayground/
// https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1
// https://cloud.google.com/apigee/docs/api-platform/security/oauth/access-tokens
