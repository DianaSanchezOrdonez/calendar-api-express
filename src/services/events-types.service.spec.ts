import faker from '@faker-js/faker'
import { EventType } from '@prisma/client'
import { NotFound } from 'http-errors'
import { clearDatabase, prisma } from '../prisma'
import { EventTypeFactory } from '../utils/factories/events-types.factory'
import { EventsTypesService } from './events-types.service'

jest.spyOn(console, 'error').mockImplementation(jest.fn())

describe.skip('EventsTypesService', () => {
  let eventTypeFactory: EventTypeFactory

  beforeAll(() => {
    eventTypeFactory = new EventTypeFactory(prisma)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect()
  })

  describe('findOne', () => {
    let eventType: EventType

    beforeAll(async () => {
      eventType = await eventTypeFactory.make()
    })

    it('should throw an error if the event type does not exist', async () => {
      await expect(
        EventsTypesService.findOne({ name: faker.name.title() }),
      ).rejects.toThrowError(new NotFound('No EventType found'))
    })

    it('should return the event type', async () => {
      const result = await EventsTypesService.findOne({ name: eventType.name })

      expect(result).toHaveProperty('uuid', eventType.uuid)
    })
  })
})
