import { addMinutes, addMonths } from 'date-fns'
import { UnprocessableEntity, BadRequest } from 'http-errors'
import axios from 'axios'
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
    const { inviteerEmail, eventName, inviteeEmail } =
      await LinksService.decodeEventData({
        hash: input.hash,
      } as HashDataDto)

    const [user, eventType] = await Promise.all([
      UsersService.findOne({ email: inviteerEmail }),
      EventsTypesService.findOne({ name: eventName }),
    ])

    // let invitee: Invitee
    // if (input.inviteeEmail) {
    //   invitee = await InviteesService.findOne({
    //     email: input.inviteeEmail,
    //   })
    // }
    // if (inviteeEmail) {
    //   invitee = await InviteesService.findOne({
    //     email: inviteeEmail,
    //   })
    // } else {
    //   throw new BadRequest('The inviteeEmail it is not provide')
    // }
    if (!input.inviteeEmail) {
      if (!inviteeEmail) {
        throw new BadRequest('The inviteeEmail it is not provide')
      }
    }

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
        inviteeEmail: inviteeEmail ?? input.inviteeEmail ?? '',
        colorId: eventType.eventColor,
      })

      // await prisma.blacklist.create({
      //   data: {
      //     hash: input.hash,
      //   },
      // })

      return this.create({
        meetingLink: data.hangoutLink,
        eventTypeUUID: eventType.uuid,
        startDatetime: eventStartTime,
        endDatetime,
        timeZone: input.timeZone,
        inviteeEmail: inviteeEmail ?? input.inviteeEmail ?? '',
        userUUID: user.uuid,
      })
    } else {
      throw new BadRequest('Busy Event Slot')
    }
  }

  static async watchGoogleEvent() {
    oAuth2Client.setCredentials({
      refresh_token: '',
    })

    // console.log('hii')
    // return GoogleService.watchEvent()
    try {
      // const result = await axios.post(
      //   'https://www.googleapis.com/calendar/v3/calendars/primary/events/watch',
      //   {
      //     headers: {
      //       Authorization:
      //         'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImIxYTgyNTllYjA3NjYwZWYyMzc4MWM4NWI3ODQ5YmZhMGExYzgwNmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzMDQ5MzQxNzI1Mi1hanVmMWoxa24xcnQwYzlqY29xcmJqMzlwZ3UycmhuZy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjMwNDkzNDE3MjUyLWFqdWYxajFrbjFydDBjOWpjb3FyYmozOXBndTJyaG5nLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE3OTg5NzIwNTc2ODUwMzkwOTI5IiwiaGQiOiJyYXZuLmNvIiwiZW1haWwiOiJkaWFuYUByYXZuLmNvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJCMWNTelJUdjh4VWhydXZ1VkE1SjRBIiwibmFtZSI6IkRpYW5hIE9yZG_DsWV6IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnWXdlUlVXTTQzSVV2UGRFeDc5RDBsMEhsZ2Jaa2FFZFJhT3dfNz1zOTYtYyIsImdpdmVuX25hbWUiOiJEaWFuYSIsImZhbWlseV9uYW1lIjoiT3Jkb8OxZXoiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY1MjkxNTU0MSwiZXhwIjoxNjUyOTE5MTQxfQ.vtDybZM9fnHYtNmjO3FyhV6bC4STlQljKJPOY_iwDrdPahHdBcnQh_r9SBDlqU6Ednq74AZQsvgve3YGrsQGBZXJ-b1jBuK-Z35NBcCTUafGQGOYQRG3E5GX4Al8AV-5bm8SdgSjOqcl6-KUkhiv3E3NP6mUwFcC8aefU0Xka4EzM7jnQrFUzdFB5jMznNYpDOERnlnlRSnwgwZZbJ1XNGRQ-XqY40rukS2LqRK6BEA7OoPLYsBe5zqUKHVWseuXgNokVv2RDRy9IFMDFJe9N2OszV4Ca929WYKzAJoJUAqVP9HVJbkewzh77CrLS301sCEWF9TyMkQCj1LQ7hjPkQ',
      //       ContentType: 'application/json',
      //     },
      //   },
      // )
      const result = await GoogleService.watchEvent()

      return result
    } catch (e: any) {
      console.log('google error', e.response.data.error)
      // console.log('google error', e)
    }
  }

  static async stopWatcherEvent() {
    try {
      oAuth2Client.setCredentials({
        refresh_token: '1//0fErH2dcvZKOUCgYIARAAGA8SNwF-L9IrYlwWbMe1kjnLuOAjy0Ok7SCDQF1vw9zH2kfp7RURxpszxHBuha3oZ4wWp_eCVyFWzaU',
      })

      const result = await GoogleService.stopWatchEvent()

      return result
    } catch (e: any) {
      if (e.response.data) {
        console.log('google error', e.response.data.error)
      }
      
      console.log('google error', e)
    }
  }
}
