import { EventType } from '@prisma/client'
import { FindOneEventTypeDto } from '../dtos/events-types/requests/find-event-type.dto'
import { prisma } from '../prisma'

export class EventsTypesService {
  static async findOne(input: FindOneEventTypeDto): Promise<EventType> {
    const event = await prisma.eventType.findUnique({
      where: {
        ...input,
      },
    })

    return event
  }
}
