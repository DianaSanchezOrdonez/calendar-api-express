import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { FindOneInviteeDto } from '../dtos/invitee/requests/find-one-invitee.dto'
import { InviteesService } from '../services/invitees.service'

export const getInvitee = async (req: Request, res: Response): Promise<void> => {
  const dto = plainToClass(FindOneInviteeDto, req.query)

  const result = await InviteesService.findOne({ email: dto.email })

  res.status(200).json(result)
}
