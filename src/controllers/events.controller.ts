import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { EventsByUserDto } from '../dtos/requests/events-by-user.dto'
import { InsertNewEventDto } from '../dtos/requests/insert-new-event.dto'
import { getListUserEvents, insertNewEvent } from '../services/events.service'

export const getListEventsByUser = async (
  req: Request,
  res: Response
): Promise<Response<'json'>> => {
  const input = plainToClass(EventsByUserDto, req.params)
  const calendar = await getListUserEvents(input)

  return res.status(200).json(calendar)
}

export const createNewEvent = async (
  req: Request,
  res: Response
): Promise<Response<'json'>> => {
  const input = plainToClass(InsertNewEventDto, req.body)
  const calendar = await insertNewEvent(input)

  return res.status(200).json(calendar)
}
