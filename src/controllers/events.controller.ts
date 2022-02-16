import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { EventsByUserDto } from '../dtos/requests/events-by-user.dto'
import { InsertNewEventDto } from '../dtos/requests/insert-new-event.dto'
import { getListUserEvents, inserNewEvent } from '../services/events.service'

export const getBusyEventsSlots = async (req: Request, res: Response) => {
  console.log('req.query', req.query)
  const events = await getListUserEvents(req.query as { email; timeZone })

  return res.status(200).send(events)
}

export const addNewEvent = async (req: Request, res: Response) => {
  const event = await inserNewEvent(req.body)

  return res.status(200).send(event)
}
