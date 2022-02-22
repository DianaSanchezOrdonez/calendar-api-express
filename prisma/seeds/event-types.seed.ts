import { PrismaClient } from '.prisma/client'

export default async (prisma: PrismaClient) => {
  return Promise.all([
    prisma.eventType.upsert({
      create: {
        location: 'Google Meet',
        eventLink: '',
        eventColor: '1',
        name: 'Initial Interview',
        eventDuration: 45,
      },
      update: {},
      where: {
        name: 'Initial Interview',
      },
    }),
    prisma.eventType.upsert({
      create: {
        location: 'Google Meet',
        eventLink: '',
        eventColor: '2',
        name: 'Challenge Review',
        eventDuration: 45,
      },
      update: {},
      where: {
        name: 'Challenge Review',
      },
    }),
    prisma.eventType.upsert({
      create: {
        location: 'Google Meet',
        eventLink: '',
        eventColor: '3',
        name: 'Final Interview',
        eventDuration: 45,
      },
      update: {},
      where: {
        name: 'Final Interview',
      },
    }),
  ])
}
