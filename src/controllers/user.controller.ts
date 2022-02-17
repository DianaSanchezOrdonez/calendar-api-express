import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { ValidateUserDto } from '../dtos/requests/validate-user.dto'
import { getUserByEmail } from '../services/users.service'

export const getUser = async (req: Request, res: Response) => {
  const input = plainToClass(ValidateUserDto, req.query)
  const user = await getUserByEmail(input.email)

  return res.status(200).json(user)
}
