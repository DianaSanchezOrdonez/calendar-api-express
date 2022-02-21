import { EventType } from '@prisma/client'
import { prisma } from '../prisma'

export class EventsTypesService {
  static async findOneByName(eventName: string): Promise<EventType> {
    const event = await prisma.eventType.findUnique({
      where: {
        name: eventName,
      },
    })

    return event
  }
}
