import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { InsertNewEventDto } from '../dtos/requests/insert-new-event.dto'
import { BusySlotsDto } from '../dtos/requests/free-busy-calendar.dto'
import { getListUserEvents, inserNewEvent } from '../services/events.service'

export const getBusyEventsSlots = async (req: Request, res: Response) => {
  const input = plainToClass(BusySlotsDto, req.query)
  const events = await getListUserEvents(input)

  return res.status(200).send(events)
}

export const addNewEvent = async (req: Request, res: Response) => {
  const input = plainToClass(InsertNewEventDto, req.body)
  const event = await inserNewEvent(input)

  return res.status(200).send(event)
}
