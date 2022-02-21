import { plainToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { ValidateUserDto } from '../dtos/users/requests/validate-user.dto'
import { UsersService } from '../services/users.service'

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const dto = plainToClass(ValidateUserDto, req.query)
  await dto.isValid()

  const result = await UsersService.getUserByEmail(dto.email)

  res.status(200).json(result)
}
