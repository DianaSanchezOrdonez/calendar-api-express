import jwt from 'jsonwebtoken'
import { BadRequest, UnprocessableEntity } from 'http-errors'
import { logger } from '../utils/logger'
import { UsersService } from './users.service'
import { oAuth2Client } from '../utils/google-oauth'
import { AccessCodeDto } from '../dtos/auths/requests/access-code.dto'
import { DecodeUserData } from '../dtos/auths/responses/decode-user-data.dto'
import { GoogleService } from './google.service'
import { UserCreatedDto } from '../dtos/users/responses/user-created.dto'

export class AuthService {
  static generateAuthUrl(): string {
    return GoogleService.generateAuthUrl()
  }

  static async signUp(input: AccessCodeDto): Promise<UserCreatedDto> {
    try {
      const { tokens } = await oAuth2Client.getToken(input.code)

      if (
        typeof tokens.id_token !== 'string' ||
        typeof tokens.refresh_token !== 'string'
      ) {
        throw new BadRequest('The token_id or refresh_token is undefined')
      }

      const dataDecoded = jwt.decode(tokens.id_token) as DecodeUserData

      return UsersService.create({
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
