import { EventType, PrismaClient } from '@prisma/client'
import { UnprocessableEntity } from 'http-errors'
import { logger } from '../helpers/logger.helper'
import { prisma } from '../prisma'

export class EventsTypesService {
  static async getEventTypeByName(eventName: string): Promise<EventType> {
    const event = await prisma.eventType.findUnique({
      where: {
        name: eventName,
      },
    })

    return event
  }
}
