import { plainToClass } from 'class-transformer'
import { AES, enc } from 'crypto-js'
import { UnprocessableEntity } from 'http-errors'
import { EncodeDataDto } from '../dtos/links/requests/endode-data.dto'
import { HashDataDto } from '../dtos/links/requests/hash-data.dto'
import { DecodeDataResponse } from '../dtos/links/responses/decode-data.dto'
import { logger } from '../utils/logger'

const CRYPTO_SECRET = process.env.CRYPTO_KEY || 'crypto_secret'

export class LinksService {
  static async encodeEventData(input: EncodeDataDto): Promise<string> {
    await input.isValid()
    try {
      const hash = AES.encrypt(
        JSON.stringify({
          inviterEmail: input.inviterEmail,
          inviteeEmail: input.inviteeEmail,
          eventName: input.eventName,
          duration: input.duration,
        }),
        CRYPTO_SECRET,
      ).toString()

      return `${process.env.FRONTEND_LINK}?hash=${hash}`
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async decodeEventData(
    input: HashDataDto,
  ): Promise<DecodeDataResponse> {
    await input.isValid()
    try {
      const data = AES.decrypt(input.hash, CRYPTO_SECRET).toString(enc.Utf8)

      return plainToClass(DecodeDataResponse, JSON.parse(data))
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }
}
