import 'reflect-metadata'
import { google } from 'googleapis'
import { plainToClass } from 'class-transformer'
import { addMinutes, addMonths } from 'date-fns'
import { v4 } from 'uuid'
import { Event, PrismaClient } from '@prisma/client'
import { UnprocessableEntity, BadRequest } from 'http-errors'
import { EventCreatedDto } from '../dtos/responses/event-created.dto'
import { logger } from '../helpers/logger.helper'
import { oAuth2Client } from '../helpers/google-oauth.helper'
import { getUserByEmail } from './users.service'
import { FreeBusyResponseDto } from '../dtos/responses/free-busy-calendar-response.dto'
import { BusySlotsDto } from '../dtos/requests/free-busy-calendar.dto'
import { InsertNewEventDto } from '../dtos/requests/insert-new-event.dto'

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

const getBusySlots = async (input: {
  eventStartTime: Date
  eventEndTime: Date
  timeZone: string
}): Promise<FreeBusyResponseDto> => {
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
  } catch (e) {
    console.log('error', e)
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

// https://developers.google.com/calendar/api/v3/reference/events/list
export const getListUserEvents = async (
  input: BusySlotsDto
): Promise<FreeBusyResponseDto> => {
  await input.isValid()
  const { email, timeZone } = input
  const user = await getUserByEmail(email)

  if (!user) {
    throw new BadRequest(`User not exist by email ${email}`)
  }

  try {
    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken,
    })

    const startDatetime = new Date()
    const endDatetime = addMonths(startDatetime, 1)

    return getBusySlots({
      eventStartTime: startDatetime,
      eventEndTime: endDatetime,
      timeZone,
    })
  } catch (e: any) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

const insertEvent = async (input: {
  eventName: string
  startDatetime: Date
  endDatetime: Date
  timeZone: string
  inviteeEmail: string
}): Promise<EventCreatedDto> => {
  try {
    const {
      eventName,
      startDatetime,
      endDatetime,
      timeZone,
      inviteeEmail,
      ...rest
    } = input
    const event = {
      summary: eventName,
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
  } catch (e) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

export const inserNewEvent = async (
  input: InsertNewEventDto
): Promise<Event> => {
  const {
    eventName,
    timeZone,
    startDatetime,
    inviterEmail,
    inviteeEmail,
    ...rest
  } = input

  await input.isValid()
  const user = await getUserByEmail(inviterEmail)

  if (!user) {
    throw new BadRequest(`User not exist by email ${inviterEmail}`)
  }

  oAuth2Client.setCredentials({
    refresh_token: user.refreshToken,
  })

  const eventStartTime = new Date(startDatetime)
  const endDatetime = addMinutes(eventStartTime, 45)

  const { data } = await getBusySlots({
    eventStartTime,
    eventEndTime: endDatetime,
    timeZone,
  })

  if (data.calendars.primary.busy.length === 0) {
    const { data } = await insertEvent({
      eventName,
      startDatetime: eventStartTime,
      endDatetime,
      timeZone,
      inviteeEmail,
      ...rest,
    })

    return createEvent({
      meetingLink: data.hangoutLink,
      eventName,
      startDatetime: eventStartTime,
      endDatetime,
      timeZone,
      inviteeEmail,
      inviterEmail,
    })
  } else {
    logger.info("Sorry I'm busy")
    throw new BadRequest('Busy event slot')
  }
}

// Repositories
const prisma = new PrismaClient()

const createEvent = async (input: {
  eventName: string
  startDatetime: Date
  endDatetime: Date
  timeZone: string
  inviteeEmail: string
  inviterEmail: string
  meetingLink: string
}): Promise<Event> => {
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
        meetingStart: startDatetime,
        meetingFinish: endDatetime,
        ...rest,
      },
    })

    return eventCreated
  } catch (e) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}
