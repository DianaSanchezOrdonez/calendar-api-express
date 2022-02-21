import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import { google } from 'googleapis'
import { v4 } from 'uuid'
import { UnprocessableEntity } from 'http-errors'
import { EventCreatedDto } from '../dtos/events/responses/event-created.dto'
import { FreeBusyResponseDto } from '../dtos/events/responses/free-busy-calendar.dto'
import { googleConfig, oAuth2Client } from '../utils/google-oauth'
import { logger } from '../utils/logger'

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

export class GoogleService {
  // https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1
  static generateAuthUrl(): string {
    try {
      const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        include_granted_scopes: true,
        response_type: 'code',
        scope: googleConfig.scope,
        prompt: 'consent',
      })

      return url
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  // https://developers.google.com/calendar/api/v3/reference/events/list
  static async getBusySlots(input: {
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
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async insertEvent(input: {
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
}
