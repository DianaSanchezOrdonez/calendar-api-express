import 'reflect-metadata'
import { google } from 'googleapis'
import { plainToClass } from 'class-transformer'
import { addMinutes, addMonths } from 'date-fns'
import { v4 } from 'uuid'
import { Event } from '@prisma/client'
import { UnprocessableEntity, BadRequest } from 'http-errors'
import { EventCreatedDto } from '../dtos/events/responses/event-created.dto'
import { logger } from '../helpers/logger.helper'
import { oAuth2Client } from '../helpers/google-oauth.helper'
import { UsersService } from './users.service'
import { FreeBusyResponseDto } from '../dtos/events/responses/free-busy-calendar.dto'
import { BusySlotsDto } from '../dtos/events/requests/busy-slots.dto'
import { InsertNewEventDto } from '../dtos/events/requests/insert-new-event.dto'
import { EventsTypesService } from './events-types.service'
import { prisma } from '../prisma'

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

export class EventsService {
  static async getBusyEventsSlots(input: {
    eventStartTime: Date
    eventEndTime: Date
    timeZone: string
  }): Promise<FreeBusyResponseDto> {
    try {
      const { eventStartTime, eventEndTime, timeZone } = input

      const busySlots = await calendar.freebusy.query({
        requestBody: {
          timeMin: eventStartTime.toISOString(),
          timeMax: eventEndTime.toISOString(),
          timeZone,
          items: [{ id: 'primary' }],
        },
      })

      return plainToClass(FreeBusyResponseDto, busySlots)
    } catch (e: any) {
      console.log('error', e)
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  // https://developers.google.com/calendar/api/v3/reference/events/list
  static async getListUserEvents(
    input: BusySlotsDto,
  ): Promise<FreeBusyResponseDto> {
    const { email, timeZone } = input
    const user = await UsersService.getUserByEmail(email)

    try {
      oAuth2Client.setCredentials({
        refresh_token: user.refreshToken,
      })

      const startDatetime = new Date()
      const endDatetime = addMonths(startDatetime, 1)

      return this.getBusyEventsSlots({
        eventStartTime: startDatetime,
        eventEndTime: endDatetime,
        timeZone,
      })
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async insertEventIntoCalendar(input: {
    summary: string
    startDatetime: Date
    endDatetime: Date
    timeZone: string
    inviteeEmail: string
    colorId: string
  }): Promise<EventCreatedDto> {
    try {
      const { startDatetime, endDatetime, timeZone, inviteeEmail, ...rest } =
        input
      const event = {
        start: {
          dateTime: startDatetime.toISOString(),
          timeZone,
        },
        end: {
          dateTime: endDatetime.toISOString(),
          timeZone,
        },
        ...rest,
      }

      const newEvent = await calendar.events.insert({
        calendarId: 'primary',
        sendUpdates: 'all',
        conferenceDataVersion: 1,
        requestBody: {
          ...event,
          attendees: [{ email: inviteeEmail }],
          conferenceData: {
            createRequest: {
              requestId: v4(),
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
            },
          },
        },
      })

      return plainToClass(EventCreatedDto, newEvent)
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async createEvent(input: {
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

  static async inserEvent(input: InsertNewEventDto): Promise<Event> {
    const { eventName, timeZone, startDatetime, inviterEmail, inviteeEmail } =
      input

    const user = await UsersService.getUserByEmail(inviterEmail)

    const eventType = await EventsTypesService.getEventTypeByName(eventName)

    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken,
    })

    const eventStartTime = new Date(startDatetime)
    const endDatetime = addMinutes(eventStartTime, 45)

    const { data } = await this.getBusyEventsSlots({
      eventStartTime,
      eventEndTime: endDatetime,
      timeZone,
    })

    if (data.calendars.primary.busy.length === 0) {
      const { data } = await this.insertEventIntoCalendar({
        summary: eventName,
        startDatetime: eventStartTime,
        endDatetime,
        timeZone,
        inviteeEmail,
        colorId: eventType.eventColor,
      })

      return this.createEvent({
        meetingLink: data.hangoutLink,
        eventName,
        startDatetime: eventStartTime,
        endDatetime,
        timeZone,
        inviteeEmail,
        inviterEmail,
      })
    } else {
      throw new BadRequest('Busy event slot')
    }
  }
}
