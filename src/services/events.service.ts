import { plainToClass } from 'class-transformer'
import { addMonths } from 'date-fns'
import { google } from 'googleapis'
import { v4 } from 'uuid'
import { EventsByUserDto } from '../dtos/requests/events-by-user.dto'
import { InsertNewEventDto } from '../dtos/requests/insert-new-event.dto'
import { EventCreatedDto } from '../dtos/responses/event-created.dto'
import { EventsByUserResponseDto } from '../dtos/responses/events-by-user.dto'
import { oauth2Client } from '../helpers/google-oauth.helper'
import { CustomError } from '../helpers/handler-error'

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
      timeZone: 'UTC',
    })

    return plainToClass(EventsByUserResponseDto, events)
  } catch (e: any) {
    console.error('getListUserEvents error: ', e)
    throw new CustomError(e, 422)
  }
}

// https://developers.google.com/calendar/api/v3/reference/events/insert
export const insertNewEvent = async (
  input: InsertNewEventDto
): Promise<EventCreatedDto> => {
  await input.isValid()
  const { calendarId, summary, candidateEmail, startDatetime, endDatetime } =
    input

  try {
    const newEvent = await calendarOuthAuth.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: {
        summary,
        start: {
          dateTime: startDatetime,
        },
        end: {
          dateTime: endDatetime,
        },
        attendees: [
          {
            email: candidateEmail,
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
    console.error('insertNewEvent error: ', e)
    throw new CustomError(e, 422)
  }
}
