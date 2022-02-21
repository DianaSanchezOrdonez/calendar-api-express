import { User } from '@prisma/client'
import { logger } from '../helpers/logger.helper'
import { UnprocessableEntity } from 'http-errors'
import { prisma } from '../prisma'

export class UsersService {
  static async createNewUser(input: {
    fullName: string
    email: string
    picture: string
    refreshToken: string
  }): Promise<User> {
    try {
      const newUser = await prisma.user.create({
        data: {
          ...input,
        },
      })

      return newUser
    } catch (e: any) {
      logger.error(e.message)
      throw new UnprocessableEntity(e.message)
    }
  }

  static async getUserByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
