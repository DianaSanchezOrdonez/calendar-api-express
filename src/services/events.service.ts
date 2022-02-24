import { addMinutes, addMonths } from 'date-fns'
import { UnprocessableEntity, BadRequest } from 'http-errors'
import { logger } from '../utils/logger'
import { oAuth2Client } from '../utils/google-oauth'
import { UsersService } from './users.service'
import { FreeBusyResponseDto } from '../dtos/events/responses/free-busy-calendar.dto'
import { BusySlotsDto } from '../dtos/events/requests/busy-slots.dto'
import { InsertNewEventDto } from '../dtos/events/requests/insert-new-event.dto'
import { EventsTypesService } from './events-types.service'
import { prisma } from '../prisma'
import { GoogleService } from './google.service'
import { CreateEventDto } from '../dtos/events/requests/create-event.dto'
import { EventIsertedDto } from '../dtos/events/responses/event-inserted.dto'
import { plainToClass } from 'class-transformer'
import { LinksService } from './links.service'
import { HashDataDto } from '../dtos/links/requests/hash-data.dto'

export class EventsService {
  static async getListUserEvents(
    input: BusySlotsDto,
  ): Promise<FreeBusyResponseDto> {
    const { email, timeZone } = input
    const user = await UsersService.findOne({ email })

    try {
      oAuth2Client.setCredentials({
        refresh_token: user.refreshToken,
      })

      const startDatetime = new Date()
      const endDatetime = addMonths(startDatetime, 1)

      return GoogleService.getBusySlots({
        eventStartTime: startDatetime,
        eventEndTime: endDatetime,
        timeZone,
      })
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async create(input: CreateEventDto): Promise<EventIsertedDto> {
    try {
      const { eventTypeUUID, userUUID, startDatetime, endDatetime, ...rest } =
        input
      const eventCreated = await prisma.event.create({
        data: {
          eventType: {
            connect: {
              uuid: eventTypeUUID,
            },
          },
          user: {
            connect: {
              uuid: userUUID,
            },
          },
          invitee: {
            connectOrCreate: {
              create: {
                email: input.inviteeEmail,
              },
              where: {
                email: input.inviteeEmail,
              },
            },
          },
          meetingStart: startDatetime,
          meetingFinish: endDatetime,
          ...rest,
        },
      })

      return plainToClass(EventIsertedDto, eventCreated)
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async insertEvent(input: InsertNewEventDto): Promise<EventIsertedDto> {
    const { inviteerEmail, eventName } = await LinksService.decodeEventData({
      hash: input.hash,
    } as HashDataDto)

    const user = await UsersService.findOne({ email: inviteerEmail })
    const eventType = await EventsTypesService.findOne({ name: eventName })

    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken,
    })

    const eventStartTime = new Date(input.startDatetime)
    const endDatetime = addMinutes(eventStartTime, eventType.eventDuration)

    const { data } = await GoogleService.getBusySlots({
      eventStartTime,
      eventEndTime: endDatetime,
      timeZone: input.timeZone,
    })

    if (data.calendars.primary.busy.length === 0) {
      const { data } = await GoogleService.insertEvent({
        summary: eventName,
        startDatetime: eventStartTime,
        endDatetime,
        timeZone: input.timeZone,
        inviteeEmail: input.inviteeEmail,
        colorId: eventType.eventColor,
      })

      await prisma.blacklist.create({
        data: {
          hash: input.hash,
        },
      })

      return this.create({
        meetingLink: data.hangoutLink,
        eventTypeUUID: eventType.uuid,
        startDatetime: eventStartTime,
        endDatetime,
        timeZone: input.timeZone,
        inviteeEmail: input.inviteeEmail,
        userUUID: user.uuid,
      })
    } else {
      throw new BadRequest('Busy Event Slot')
    }
  }
}
