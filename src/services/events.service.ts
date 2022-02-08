import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import { addMinutes, addMonths } from 'date-fns'
import { google } from 'googleapis'
import { v4 } from 'uuid'
import { EventsByUserDto } from '../dtos/requests/events-by-user.dto'
import { InsertNewEventDto } from '../dtos/requests/insert-new-event.dto'
import { EventCreatedDto } from '../dtos/responses/event-created.dto'
import { EventsByUserResponseDto } from '../dtos/responses/events-by-user.dto'
import { oauth2Client } from '../helpers/google-oauth.helper'
import { EventTypeEnum } from '../enums/event-type.enum'
import { logger } from '../helpers/logger.helper'
import createError from 'http-errors'

const calendarOuthAuth = google.calendar({
  version: 'v3',
  auth: oauth2Client,
})

// https://developers.google.com/calendar/api/v3/reference/events/list
export const getListUserEvents = async (
  input: EventsByUserDto
): Promise<EventsByUserResponseDto> => {
  await input.isValid()
  const startDatetime = new Date()
  const endDatetime = addMonths(startDatetime, 1)

  try {
    const events = await calendarOuthAuth.events.list({
      calendarId: input.userId,
      timeMin: startDatetime.toISOString(),
      timeMax: endDatetime.toISOString(),
      orderBy: 'startTime',
      singleEvents: true,
      timeZone: 'UTC+00',
    })

    return plainToClass(EventsByUserResponseDto, events)
  } catch (e: any) {
    logger.error(e.message)
    throw createError(422, {
      level: 'getListUserEvents',
      message: e.message,
    })
  }
}

// https://developers.google.com/calendar/api/v3/reference/events/insert
export const insertNewEvent = async (
  input: InsertNewEventDto
): Promise<EventCreatedDto> => {
  await input.isValid()
  const { eventType, claimerEmail, candidateEmail, startDatetime, timeZone } =
    input
  const endDatetime = addMinutes(new Date(startDatetime), 45)
  let calendarId: string

  switch (eventType) {
    case EventTypeEnum.initialInterview:
      calendarId = process.env.INITIAL_INTERVIEW_ID
      break
    case EventTypeEnum.challengeInterview:
      calendarId = process.env.CHALLENGE_INTERVIEW_ID
      break
    case EventTypeEnum.finalInterview:
      calendarId = process.env.FINAL_INTERVIEW_ID
      break
    default:
      break
  }

  try {
    const newEvent = await calendarOuthAuth.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: {
        summary: eventType,
        start: {
          dateTime: startDatetime,
          timeZone,
        },
        end: {
          dateTime: endDatetime.toISOString(),
          timeZone,
        },
        attendees: [
          {
            email: candidateEmail,
          },
          {
            email: claimerEmail,
          },
        ],
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
    throw createError(422, {
      level: 'insertNewEvent',
      message: e.message,
    })
  }
}
