// import { addMonths } from 'date-fns'
// import { AccessControlRuleDto } from '../dtos/requests/access-control-rule.dto'
// import { FreeAndBusyCalendarDto } from '../dtos/requests/free-busy-calendar.dto'
// import { FreeBusyResponseDto } from '../dtos/responses/free-busy-calendar-response.dto'
// import { plainToClass } from 'class-transformer'
// import { logger } from '../helpers/logger.helper'
// import createError from 'http-errors'


// const getShareableLink = (calendarId: string): string => {
//   const encodeId = Buffer.from(calendarId, 'base64')

//   return `https://calendar.google.com/calendar?cid=${encodeId}`
// }

// // https://developers.google.com/calendar/api/v3/reference/freebusy/query
// export const freeOrBusyCalendar = async (
//   input: FreeAndBusyCalendarDto
// ): Promise<FreeBusyResponseDto> => {
//   await input.isValid()
//   const startDatetime = new Date()
//   const endDatetime = addMonths(startDatetime, 1)

//   try {
//     const freeBusyCalendar = await calendar.freebusy.query({
//       requestBody: {
//         timeMin: startDatetime.toISOString(),
//         timeMax: endDatetime.toISOString(),
//         timeZone: 'UTC',
//         items: [
//           {
//             id: input.claimerEmail,
//           },
//         ],
//       },
//     })

//     return plainToClass(FreeBusyResponseDto, freeBusyCalendar)
//   } catch (e: any) {
//     logger.error(e.message)
//     throw createError(422, {
//       level: 'freeOrBusyCalendar',
//       message: e.message,
//     })
//   }
// }

// // https://developers.google.com/calendar/api/v3/reference/acl/insert
// export const insertAccessControlRule = async (
//   calendarId: string,
//   input: AccessControlRuleDto
// ): Promise<string> => {
//   await input.isValid()

//   try {
//     await calendar.acl.insert({
//       calendarId,
//       requestBody: {
//         role: input.role,
//         scope: {
//           type: 'default',
//         },
//       },
//     })

//     const shareableLink = getShareableLink(calendarId)

//     return shareableLink
//   } catch (e: any) {
//     logger.error(e.message)
//     throw createError(422, {
//       level: 'insertAccessControlRule',
//       message: e.message,
//     })
//   }
// }
