import 'reflect-metadata'
import { google } from 'googleapis'
import { plainToClass } from 'class-transformer'
import { addMinutes, addMonths } from 'date-fns'
import { v4 } from 'uuid'
import { UnprocessableEntity, NotFound, Forbidden } from 'http-errors'
import { InsertNewEventDto } from '../dtos/requests/insert-new-event.dto'
import { EventCreatedDto } from '../dtos/responses/event-created.dto'
import { logger } from '../helpers/logger.helper'
import { oAuth2Client } from '../helpers/google-oauth.helper'
import { getUserByEmail } from './users.service'
import { FreeBusyResponseDto } from '../dtos/responses/free-busy-calendar-response.dto'

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

const getBusySlots = async (input: {
  eventStartTime: string
  eventEndTime: string
  timeZone: string
}): Promise<FreeBusyResponseDto> => {
  try {
    const { eventStartTime, eventEndTime, timeZone } = input

    const busySlots = await calendar.freebusy.query({
      requestBody: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone,
        items: [{ id: 'primary' }],
      },
    })

    return plainToClass(FreeBusyResponseDto, busySlots)
  } catch (e) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

// https://developers.google.com/calendar/api/v3/reference/events/list
export const getListUserEvents = async (input: {
  email: string
  timeZone: string
}): Promise<FreeBusyResponseDto> => {
  try {
    const { email, timeZone } = input
    const user = await getUserByEmail(email)

    if (!user) {
      throw new NotFound(`User not exist by email ${email}`)
    }

    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken,
    })

    const startDatetime = new Date()
    const endDatetime = addMonths(startDatetime, 1)

    return getBusySlots({
      eventStartTime: startDatetime.toISOString(),
      eventEndTime: endDatetime.toISOString(),
      timeZone,
    })
  } catch (e: any) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

const insertEvent = async (input: {
  eventName
  location
  description
  startDatetime
  endDatetime
  timeZone
  invitee
}): Promise<EventCreatedDto> => {
  try {
    const {
      eventName,
      startDatetime,
      endDatetime,
      timeZone,
      invitee,
      ...rest
    } = input
    const event = {
      summary: eventName,
      start: {
        dateTime: startDatetime,
        timeZone,
      },
      end: {
        dateTime: endDatetime,
        timeZone,
      },
      colorId: '1',
      ...rest,
    }

    const newEvent = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        ...event,
        attendees: [{ email: invitee }],
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
  } catch (e) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

export const inserNewEvent = async (input: {
  timeZone: string
  eventName: string
  location: string
  description: string
  startDatetime: string
  invitee: string
  inviter: string
}) => {
  const { eventName, timeZone, startDatetime, inviter, invitee, ...rest } =
    input

  const user = await getUserByEmail(inviter)

  if (!user) {
    throw new NotFound(`User not exist by email ${inviter}`)
  }

  oAuth2Client.setCredentials({
    refresh_token: user.refreshToken,
  })

  const endDatetime = addMinutes(new Date(startDatetime), 45).toISOString()

  const { data } = await getBusySlots({
    eventStartTime: startDatetime,
    eventEndTime: endDatetime,
    timeZone,
  })

  if (data.calendars.primary.busy.length === 0) {
    return insertEvent({
      eventName,
      startDatetime,
      endDatetime,
      timeZone,
      invitee,
      ...rest,
    })
  } else {
    logger.info("Sorry I'm busy")
    throw new Forbidden('Busy event slot')
  }
}
