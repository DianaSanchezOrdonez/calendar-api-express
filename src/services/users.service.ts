import { User } from '@prisma/client'
import { logger } from '../utils/logger'
import { UnprocessableEntity } from 'http-errors'
import { prisma } from '../prisma'
import { plainToClass } from 'class-transformer'
import { UserCreatedDto } from '../dtos/users/responses/user-created.dto'
import { CreateUserDto } from '../dtos/users/requests/create-user.dto'

export class UsersService {
  static async create(input: CreateUserDto): Promise<UserCreatedDto> {
    const userFound = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
      rejectOnNotFound: false,
    })

    if (userFound) {
      throw new UnprocessableEntity('email already taken')
    }

    try {
      const newUser = await prisma.user.create({
        data: {
          ...input,
        },
      })

      return plainToClass(UserCreatedDto, newUser)
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async findOneByEmail(email: string): Promise<UserCreatedDto> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return plainToClass(UserCreatedDto, user)
  }
}
