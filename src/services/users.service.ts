import { User, PrismaClient } from '@prisma/client'
import { logger } from '../helpers/logger.helper'
import { UnprocessableEntity } from 'http-errors'

const prisma = new PrismaClient()

export const createNewUser = async (input: {
  fullName: string
  email: string
  picture: string
  refreshToken: string
}): Promise<User> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        ...input,
      },
    })

    return newUser
  } catch (e) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  } catch (e) {
    logger.error(e.message)
    throw new UnprocessableEntity(e.message)
  }
}

const onModuleInit = async () => {
  await prisma.$connect()
}

const onModuleDestroy = async () => {
  await prisma.$disconnect()
}
