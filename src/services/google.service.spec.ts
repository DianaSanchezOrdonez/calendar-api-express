import faker from '@faker-js/faker'
import { GoogleService } from './google.service'

// jest.mock('googleapis', () => {
//   return {
//     setApiKey: jest.fn(),
//     send: jest.fn().mockImplementation(() =>
//       Promise.resolve([
//         {
//           statusCode: 200,
//           headers: {},
//           body: '',
//         },
//       ]),
//     ),
//   }
// })

jest.mock('googleapis', () => {
  return {
    google: {
      auth: {
        OAuth2: jest.fn(),
      },
      calendar: () => ({
        freebusy: {
          query: jest.fn().mockImplementation(() =>
            Promise.resolve([
              {
                statusCode: 200,
                headers: {},
                body: '',
              },
            ]),
          ),
        },
      }),
    },
  }
})

describe('GoogleService', () => {
  describe('getBusySlots', () => {
    const spy = jest
      .spyOn(GoogleService, 'getBusySlots')
    // const result = GoogleService.getBusySlots({
    //   eventStartTime: faker.datatype.datetime(),
    //   eventEndTime: faker.datatype.datetime(),
    //   timeZone: 'America/Lima',
    // })

    // expect(result).toBeUndefined()
    expect(spy).toBeCalledWith([
      {
        statusCode: 200,
        headers: {},
        body: '',
      },
    ])
  })
})
