import { Prisma, User, PrismaClient } from '@prisma/client'
import faker from '@faker-js/faker'
import { AbstractFactory } from './abstract.factory'

type UserInput = Partial<Prisma.UserCreateInput>

export class UserFactory extends AbstractFactory<User> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super()
  }
  async make(input: UserInput = {}): Promise<User> {
    return this.prismaClient.user.create({
      data: {
        ...input,
        fullName: input.fullName ?? faker.name.findName(),
        email: input.email ?? faker.internet.email(),
        picture: input.picture ?? faker.image.imageUrl(),
        refreshToken: input.refreshToken ?? faker.internet.password(),
      },
    })
  }
  async makeMany(factorial: number, input: UserInput = {}): Promise<User[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)))
  }
}
