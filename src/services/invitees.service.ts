import { Invitee } from '@prisma/client'
import { UnprocessableEntity } from 'http-errors'
import { FindOneInviteeDto } from '../dtos/invitee/requests/find-one-invitee.dto'
import { prisma } from '../prisma'
import { logger } from '../utils/logger'

export class InviteesService {
  static async findOne(input: FindOneInviteeDto): Promise<Invitee> {
    const invitee = await prisma.invitee.findUnique({
      where: {
        ...input,
      },
    })

    return invitee
  }

  static async create(email: string): Promise<Invitee> {
    const inviteeFound = await prisma.invitee.findUnique({
      where: { email },
      select: { id: true },
      rejectOnNotFound: false,
    })

    if (inviteeFound) {
      throw new UnprocessableEntity('email already taken')
    }

    try {
      const invitee = await prisma.invitee.create({
        data: {
          email,
        },
      })

      return invitee
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }
}
