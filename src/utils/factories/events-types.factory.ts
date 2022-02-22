import { EventType, Prisma, PrismaClient } from '.prisma/client'
import faker from '@faker-js/faker'
import { AbstractFactory } from './abstract.factory'

type EventTypeInput = Partial<Prisma.EventTypeCreateInput>

export class EvenTypeFactory extends AbstractFactory<EventType> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super()
  }
  async make(input: EventTypeInput = {}): Promise<EventType> {
    return this.prismaClient.eventType.create({
      data: {
        ...input,
        name: input.name ?? faker.name.title(),
        eventLink: input.eventLink ?? faker.internet.url(),
        eventColor: input.eventColor ?? faker.internet.color(),
        location: input.location ?? faker.address.streetAddress(),
        eventDuration:
          input.eventDuration ?? faker.datatype.number({ min: 15, max: 60 }),
      },
    })
  }
  async makeMany(
    factorial: number,
    input: EventTypeInput = {},
  ): Promise<EventType[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)))
  }
}
