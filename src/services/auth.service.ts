import jwt from 'jsonwebtoken'
import { BadRequest, UnprocessableEntity } from 'http-errors'
import { logger } from '../helpers/logger.helper'
import { UsersService } from './users.service'
import { googleConfig, oAuth2Client } from '../helpers/google-oauth.helper'
import { AccessCodeDto } from '../dtos/auths/requests/access-code.dto'
import { DecodeUserData } from '../dtos/auths/responses/decode-user-data.dto'

export class AuthService {
  // https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1
  static generateAuthUrl() {
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

  static async signUp(input: AccessCodeDto) {
    try {
      const { tokens } = await oAuth2Client.getToken(input.code)

      if (
        typeof tokens.id_token !== 'string' ||
        typeof tokens.refresh_token !== 'string'
      ) {
        throw new BadRequest('The token_id or refresh_token is undefined')
      }

      const dataDecoded = jwt.decode(tokens.id_token) as DecodeUserData

      return UsersService.createNewUser({
        fullName: dataDecoded.name,
        email: dataDecoded.email,
        picture: dataDecoded.picture,
        refreshToken: tokens.refresh_token,
      })
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }
}
