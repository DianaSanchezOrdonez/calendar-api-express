import faker from '@faker-js/faker'
import { logger } from '../utils/logger'
import { GoogleService } from './google.service'

jest.spyOn(logger, 'error').mockImplementation(jest.fn())

jest.mock('googleapis', () => {
  return {
    google: {
      auth: {
        OAuth2: jest.fn(),
      },
      calendar: () => ({
        freebusy: {
          query: jest
            .fn()
            .mockImplementationOnce(() =>
              Promise.resolve([
                {
                  statusCode: 200,
                  headers: {},
                  body: '',
                },
              ]),
            )
            .mockImplementationOnce(() => {
              throw new Error()
            }),
        },
        events: {
          insert: jest
            .fn()
            .mockImplementationOnce(() =>
              Promise.resolve([
                {
                  statusCode: 200,
                  headers: {},
                  body: '',
                },
              ]),
            )
            .mockImplementationOnce(() => {
              throw new Error()
            }),
        },
      }),
    },
  }
})

describe('GoogleService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getBusySlots', () => {
    it('should return the busy slots of the user', async () => {
      const startTime = faker.datatype.datetime()
      const endTime = faker.datatype.datetime({ min: startTime.getDate() })
      const result = await GoogleService.getBusySlots({
        eventStartTime: startTime,
        eventEndTime: endTime,
        timeZone: 'America/Lima',
      })

      expect(result).toHaveProperty('data', result.data)
    })

    it('should throw error when the datetimes it is wrong', async () => {
      const startTime = faker.datatype.datetime()
      const endTime = faker.datatype.datetime({ min: startTime.getDate() })
      const input = {
        eventStartTime: endTime,
        eventEndTime: startTime,
        timeZone: 'America/Lima',
      }

      await expect(GoogleService.getBusySlots(input)).rejects.toThrowError()
    })
  })

  describe('insertEvent', () => {
    it('should return the new event inserted', async () => {
      const result = await GoogleService.insertEvent({
        summary: faker.datatype.string(10),
        startDatetime: faker.datatype.datetime(),
        endDatetime: faker.datatype.datetime(),
        timeZone: faker.address.timeZone(),
        inviteeEmail: faker.internet.email(),
        colorId: '1',
      })

      expect(result).toHaveProperty('data', result.data)
    })
  })
})
