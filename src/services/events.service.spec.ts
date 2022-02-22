import { EventType, User } from '.prisma/client'
import faker from '@faker-js/faker'
import { plainToClass } from 'class-transformer'
import { NotFound } from 'http-errors'
import { CreateEventDto } from '../dtos/events/requests/create-event.dto'
import { InsertNewEventDto } from '../dtos/events/requests/insert-new-event.dto'
import { clearDatabase, prisma } from '../prisma'
import { EvenTypeFactory } from '../utils/factories/events-types.factory'
import { EventFactory } from '../utils/factories/events.factory'
import { UserFactory } from '../utils/factories/user.factory'
import { EventsService } from './events.service'

jest.spyOn(console, 'error').mockImplementation(jest.fn())

describe('EventService', () => {
  let eventFactory: EventFactory
  let eventTypeFactory: EvenTypeFactory
  let userFactory: UserFactory

  beforeAll(() => {
    eventFactory = new EventFactory(prisma)
    eventTypeFactory = new EvenTypeFactory(prisma)
    userFactory = new UserFactory(prisma)
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

    beforeAll(async () => {
      eventType = await eventTypeFactory.make()
      user = await userFactory.make()
    })

    it('should throw an error if the user does not exist', async () => {
      const data = plainToClass(InsertNewEventDto, {
        startDatetime: faker.datatype.datetime(),
        endDatetime: faker.datatype.datetime(),
        timeZone: faker.address.timeZone(),
        inviteeEmail: faker.internet.email(),
        meetingLink: faker.internet.url(),
        eventName: eventType.name,
        inviterEmail: faker.internet.email(),
      })

      await expect(EventsService.insertEvent(data)).rejects.toThrowError(
        new NotFound('No User found'),
      )
    })

    it('should throw an error if the event type does not exist', async () => {
      const data = plainToClass(InsertNewEventDto, {
        startDatetime: faker.datatype.datetime(),
        endDatetime: faker.datatype.datetime(),
        timeZone: faker.address.timeZone(),
        inviteeEmail: faker.internet.email(),
        meetingLink: faker.internet.url(),
        eventName: faker.name.title(),
        inviterEmail: user.email,
      })

      await expect(EventsService.insertEvent(data)).rejects.toThrowError(
        new NotFound('No EventType found'),
      )
    })
  })
})
