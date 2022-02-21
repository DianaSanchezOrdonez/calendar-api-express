import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { AccessCodeDto } from '../dtos/auths/requests/access-code.dto'

export const generateAuthLink = (req: Request, res: Response): void => {
  const result = AuthService.generateAuthUrl()

  res.status(200).json(result)
}

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const dto = plainToClass(AccessCodeDto, req.body)
  await dto.isValid()

  const result = await AuthService.signUp(dto)

  res.status(201).json(result)
}


