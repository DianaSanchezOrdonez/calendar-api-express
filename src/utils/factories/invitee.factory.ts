import { Prisma, Invitee, PrismaClient } from '@prisma/client'
import faker from '@faker-js/faker'
import { AbstractFactory } from './abstract.factory'

type InviteeInput = Partial<Prisma.InviteeCreateInput>

export class InviteeFactory extends AbstractFactory<Invitee> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super()
  }
  async make(input: InviteeInput = {}): Promise<Invitee> {
    return this.prismaClient.invitee.create({
      data: {
        ...input,
        email: input.email ?? faker.internet.email(),
      },
    })
  }
  async makeMany(
    factorial: number,
    input: InviteeInput = {},
  ): Promise<Invitee[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)))
  }
}
