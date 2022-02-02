import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { AccessControlRuleDto } from '../dtos/requests/access-control-rule.dto'
import { FreeAndBusyCalendarDto } from '../dtos/requests/free-busy-calendar.dto'
import {
  freeOrBusyCalendar,
  insertAccessControlRule,
} from '../services/calendar.service'

export const getUserCalendar = async (
  req: Request,
  res: Response
): Promise<Response<'json'>> => {
  const input = plainToClass(FreeAndBusyCalendarDto, req.body)
  const calendar = await freeOrBusyCalendar(input)

  return res.status(200).json(calendar)
}

export const getShareableLink = async (
  req: Request,
  res: Response
): Promise<Response<'json'>> => {
  const input = plainToClass(AccessControlRuleDto, req.body)
  const calendar = await insertAccessControlRule(req.params.calendarId, input)

  return res.status(200).json(calendar)
}
