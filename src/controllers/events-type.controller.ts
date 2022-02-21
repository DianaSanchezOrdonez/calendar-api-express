import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { GetEventTypeDto } from '../dtos/events-types/requests/get-event-type.dto'
import { EventsTypesService } from '../services/events-types.service'

export const getEventType = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const dto = plainToClass(GetEventTypeDto, req.query)
  await dto.isValid()

  const result = await EventsTypesService.getEventTypeByName(dto.eventName)

  res.status(200).json(result)
}
