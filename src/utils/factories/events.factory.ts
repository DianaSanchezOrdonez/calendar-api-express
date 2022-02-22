import { Event, Prisma, PrismaClient } from '.prisma/client'
import faker from '@faker-js/faker'
import { AbstractFactory } from './abstract.factory'

type EventInput = Partial<Prisma.EventCreateInput> &
  Pick<Prisma.EventCreateInput, 'eventType' | 'user' | 'invitee'>

export class EventFactory extends AbstractFactory<Event> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super()
  }
  async make(input: EventInput): Promise<Event> {
    return this.prismaClient.event.create({
      data: {
        ...input,
        meetingStart: input.meetingStart ?? faker.datatype.datetime(),
        meetingFinish: input.meetingFinish ?? faker.datatype.datetime(),
        meetingLink: input.meetingLink ?? faker.internet.url(),
        timeZone: input.timeZone ?? faker.address.timeZone(),
        inviteeEmail: input.inviteeEmail ?? faker.internet.email(),
        eventType: input.eventType,
        // user: input.user,
        // invitee: input.invitee,
      },
    })
  }
  async makeMany(factorial: number, input: EventInput): Promise<Event[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)))
  }
}
