import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { InsertNewEventDto } from '../dtos/events/requests/insert-new-event.dto'
import { BusySlotsDto } from '../dtos/events/requests/busy-slots.dto'
import { EventsService } from '../services/events.service'

export const getBusyEventsSlots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const dto = plainToClass(BusySlotsDto, req.query)
  await dto.isValid()

  const result = await EventsService.getListUserEvents(dto)

  res.status(200).json(result)
}

export const addNewEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const dto = plainToClass(InsertNewEventDto, req.body)
  await dto.isValid()

  const result = await EventsService.insertEvent(dto)

  res.status(201).json(result)
}
