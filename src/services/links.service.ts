import { plainToClass } from 'class-transformer'
import { AES, enc } from 'crypto-js'
import { UnprocessableEntity } from 'http-errors'
import { EncodeDataDto } from '../dtos/links/requests/endode-data.dto'
import { HashDataDto } from '../dtos/links/requests/hash-data.dto'
import { DecodeDataResponse } from '../dtos/links/responses/decode-data.dto'
import { prisma } from '../prisma'
import { logger } from '../utils/logger'
import { EventsTypesService } from './events-types.service'
import { InviteesService } from './invitees.service'
import { UsersService } from './users.service'

const CRYPTO_SECRET = process.env.CRYPTO_KEY || 'crypto_secret'

export class LinksService {
  static async encodeEventData(input: EncodeDataDto): Promise<string> {
    const [user, eventType, invitee] = await Promise.all([
      UsersService.findOne({ uuid: input.inviterUUID }),
      EventsTypesService.findOne({ uuid: input.eventTypeUUID }),
      InviteesService.findOne({ uuid: input.inviteeUUID }),
    ])

    try {
      const hash = AES.encrypt(
        JSON.stringify({
          candidateEmail: invitee.email,
          claimerEmail: user.email,
          eventName: eventType.name,
          duration: eventType.eventDuration,
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
    const hashFound = await prisma.blacklist.findUnique({
      where: {
        hash: input.hash,
      },
      select: { id: true },
      rejectOnNotFound: false,
    })

    if (hashFound) {
      throw new UnprocessableEntity('invalid hash')
    }

    let data: string
    try {
      data = AES.decrypt(input.hash, CRYPTO_SECRET).toString(enc.Utf8)
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }

    if (data) {
      try {
        await prisma.blacklist.create({
          data: {
            hash: input.hash,
          },
        })
        const parseData = JSON.parse(data)

        return plainToClass(DecodeDataResponse, parseData)
      } catch (e: any) {
        logger.error(e.message)
        throw new UnprocessableEntity(e.message)
      }
    } else {
      throw new UnprocessableEntity('error in decrypt the hash')
    }
  }
}
