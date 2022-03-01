import { Blacklist, EventType, Invitee, User } from '.prisma/client'
import faker from '@faker-js/faker'
import { plainToClass } from 'class-transformer'
import { BadRequest, UnprocessableEntity } from 'http-errors'
import { CreateEventDto } from '../dtos/events/requests/create-event.dto'
import { InsertNewEventDto } from '../dtos/events/requests/insert-new-event.dto'
import { EncodeDataDto } from '../dtos/links/requests/endode-data.dto'
import { clearDatabase, prisma } from '../prisma'
import { BlacklistFactory } from '../utils/factories/blacklists.factory'
import { EventTypeFactory } from '../utils/factories/events-types.factory'
import { InviteeFactory } from '../utils/factories/invitee.factory'
import { UserFactory } from '../utils/factories/user.factory'
import { logger } from '../utils/logger'
import { EventsService } from './events.service'
import { LinksService } from './links.service'

jest.spyOn(logger, 'error').mockImplementation(jest.fn())

describe('EventService', () => {
  let inviteeFactory: InviteeFactory
  let eventTypeFactory: EventTypeFactory
  let userFactory: UserFactory
  let blacklistFactory: BlacklistFactory

  beforeAll(() => {
    inviteeFactory = new InviteeFactory(prisma)
    eventTypeFactory = new EventTypeFactory(prisma)
    userFactory = new UserFactory(prisma)
    blacklistFactory = new BlacklistFactory(prisma)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect()
  })

  describe('create', () => {
    let eventType: EventType
    let user: User

    it('should create a new event', async () => {
      eventType = await eventTypeFactory.make()
      user = await userFactory.make()

      const data = plainToClass(CreateEventDto, {
        startDatetime: faker.datatype.datetime(),
        endDatetime: faker.datatype.datetime(),
        timeZone: faker.address.timeZone(),
        inviteeEmail: faker.internet.email(),
        meetingLink: faker.internet.url(),
        eventTypeUUID: eventType.uuid,
        userUUID: user.uuid,
      })

      const result = await EventsService.create(data)

      expect(result).toHaveProperty('uuid', result.uuid)
    })
  })

  describe('insertEvent', () => {
    let eventType: EventType
    let user: User
    let blacklist: Blacklist
    let invitee: Invitee

    beforeAll(async () => {
      eventType = await eventTypeFactory.make()
      user = await userFactory.make()
      blacklist = await blacklistFactory.make()
      invitee = await inviteeFactory.make()
    })

    it('should throw an error if the hash exists into blacklist', async () => {
      const data = plainToClass(InsertNewEventDto, {
        hash: blacklist.hash,
        timeZone: faker.address.timeZone(),
        startDatetime: faker.datatype.datetime(),
      })

      await expect(EventsService.insertEvent(data)).rejects.toThrowError(
        new UnprocessableEntity('invalid hash'),
      )
    })

    it('should throw an error if the inviteeEmail not exist', async () => {
      const url = await LinksService.encodeEventData(
        plainToClass(EncodeDataDto, {
          inviterUUID: user.uuid,
          eventTypeUUID: eventType.uuid,
        }),
      )
      const hash = url.split('hash=')[1]
      const data = plainToClass(InsertNewEventDto, {
        hash,
        timeZone: faker.address.timeZone(),
        startDatetime: faker.datatype.datetime(),
      })

      await expect(EventsService.insertEvent(data)).rejects.toThrowError(
        new BadRequest('The inviteeEmail it is not provide'),
      )
    })
  })
})
