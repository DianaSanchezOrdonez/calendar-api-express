import faker from '@faker-js/faker'
import { Blacklist, EventType, User, Invitee } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { NotFound, UnprocessableEntity } from 'http-errors'
import { EncodeDataDto } from '../dtos/links/requests/endode-data.dto'
import { HashDataDto } from '../dtos/links/requests/hash-data.dto'
import { clearDatabase, prisma } from '../prisma'
import { EventTypeFactory } from '../utils/factories/events-types.factory'
import { InviteeFactory } from '../utils/factories/invitee.factory'
import { BlacklistFactory } from '../utils/factories/links.factory'
import { UserFactory } from '../utils/factories/user.factory'
import { LinksService } from './links.service'

jest.spyOn(console, 'error').mockImplementation(jest.fn())

describe.skip('LinksService', () => {
  let blacklistFactory: BlacklistFactory
  let userFactory: UserFactory
  let eventTypeFactory: EventTypeFactory
  let inviteeFactory: InviteeFactory

  beforeAll(() => {
    blacklistFactory = new BlacklistFactory(prisma)
    userFactory = new UserFactory(prisma)
    eventTypeFactory = new EventTypeFactory(prisma)
    inviteeFactory = new InviteeFactory(prisma)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect()
  })

  describe('encodeEventData', () => {
    let user: User
    let eventType: EventType
    let invitee: Invitee

    beforeAll(async () => {
      user = await userFactory.make()
      eventType = await eventTypeFactory.make()
      invitee = await inviteeFactory.make()
    })

    it('should throw an error if the user does not exist', async () => {
      const data = plainToClass(EncodeDataDto, {
        inviterUUID: faker.datatype.uuid(),
        inviteeUUID: invitee.uuid,
        eventTypeUUID: eventType.uuid,
      })

      await expect(LinksService.encodeEventData(data)).rejects.toThrowError(
        new NotFound('No User found'),
      )
    })

    it('should throw an error if the invitee does not exist', async () => {
      const data = plainToClass(EncodeDataDto, {
        inviterUUID: user.uuid,
        inviteeUUID: faker.datatype.uuid(),
        eventTypeUUID: eventType.uuid,
      })

      await expect(LinksService.encodeEventData(data)).rejects.toThrowError(
        new NotFound('No Invitee found'),
      )
    })

    it('should throw an error if the event type does not exist', async () => {
      const data = plainToClass(EncodeDataDto, {
        inviterUUID: user.uuid,
        inviteeUUID: invitee.uuid,
        eventTypeUUID: faker.datatype.uuid(),
      })

      await expect(LinksService.encodeEventData(data)).rejects.toThrowError(
        new NotFound('No EventType found'),
      )
    })

    it('should return the data encoded', async () => {
      const data = plainToClass(EncodeDataDto, {
        inviterUUID: user.uuid,
        inviteeUUID: invitee.uuid,
        eventTypeUUID: eventType.uuid,
      })

      const result = await LinksService.encodeEventData(data)

      expect(result).not.toBeNull()
      expect(result).not.toBeUndefined()
    })
  })

  describe('decodeEventData', () => {
    let blacklist: Blacklist
    let user: User
    let eventType: EventType
    let invitee: Invitee

    beforeAll(async () => {
      blacklist = await blacklistFactory.make()
      user = await userFactory.make()
      eventType = await eventTypeFactory.make()
      invitee = await inviteeFactory.make()
    })

    it('should throw an error if the hash exists into blacklist', async () => {
      const data = plainToClass(HashDataDto, {
        hash: blacklist.hash,
      })

      await expect(LinksService.decodeEventData(data)).rejects.toThrowError(
        new UnprocessableEntity('invalid hash'),
      )
    })

    it('should throw an error if the hash cannot decrypt', async () => {
      const data = plainToClass(HashDataDto, {
        hash: faker.datatype.string(),
      })

      await expect(LinksService.decodeEventData(data)).rejects.toThrowError(
        new UnprocessableEntity('error in decrypt the hash'),
      )
    })
  })
})
