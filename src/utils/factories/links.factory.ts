import { Prisma, Blacklist, PrismaClient } from '@prisma/client'
import faker from '@faker-js/faker'
import { AbstractFactory } from './abstract.factory'

type BlacklistInput = Partial<Prisma.BlacklistCreateInput>

export class BlacklistFactory extends AbstractFactory<Blacklist> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super()
  }
  async make(input: BlacklistInput = {}): Promise<Blacklist> {
    return this.prismaClient.blacklist.create({
      data: {
        ...input,
        hash: input.hash ?? faker.datatype.string(),
        updatedAt: input.updatedAt ?? null,
      },
    })
  }
  async makeMany(
    factorial: number,
    input: BlacklistInput = {},
  ): Promise<Blacklist[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)))
  }
}
