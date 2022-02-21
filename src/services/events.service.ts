import { addMinutes, addMonths } from 'date-fns'
import { Event } from '@prisma/client'
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

export class EventsService {
  static async getListUserEvents(
    input: BusySlotsDto,
  ): Promise<FreeBusyResponseDto> {
    const { email, timeZone } = input
    const user = await UsersService.findOneByEmail(email)

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

  static async create(input: {
    eventName: string
    startDatetime: Date
    endDatetime: Date
    timeZone: string
    inviteeEmail: string
    inviterEmail: string
    meetingLink: string
  }): Promise<Event> {
    try {
      const { eventName, startDatetime, endDatetime, inviterEmail, ...rest } =
        input
      const eventCreated = await prisma.event.create({
        data: {
          eventType: {
            connect: {
              name: eventName,
            },
          },
          user: {
            connect: {
              email: inviterEmail,
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

      return eventCreated
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async insertEvent(input: InsertNewEventDto): Promise<Event> {
    const { eventName, timeZone, startDatetime, inviterEmail, inviteeEmail } =
      input

    const user = await UsersService.findOneByEmail(inviterEmail)

    const eventType = await EventsTypesService.findOneByName(eventName)

    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken,
    })

    const eventStartTime = new Date(startDatetime)
    const endDatetime = addMinutes(eventStartTime, 45)

    const { data } = await GoogleService.getBusySlots({
      eventStartTime,
      eventEndTime: endDatetime,
      timeZone,
    })

    if (data.calendars.primary.busy.length === 0) {
      const { data } = await GoogleService.insertEvent({
        summary: eventName,
        startDatetime: eventStartTime,
        endDatetime,
        timeZone,
        inviteeEmail,
        colorId: eventType.eventColor,
      })

      return this.create({
        meetingLink: data.hangoutLink,
        eventName,
        startDatetime: eventStartTime,
        endDatetime,
        timeZone,
        inviteeEmail,
        inviterEmail,
      })
    } else {
      throw new BadRequest('Busy Event Slot')
    }
  }
}
