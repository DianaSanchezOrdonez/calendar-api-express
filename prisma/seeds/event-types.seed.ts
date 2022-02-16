import { PrismaClient } from '.prisma/client'

export default async (prisma: PrismaClient) => {
  return Promise.all([
    prisma.eventType.create({
      data: {
        uuid: 'ckr179asp000101l933qzfz73',
        location: 'Google Meet',
        eventLink: '',
        eventColor: '1',
        name: 'Initial Interview',
      },
    }),
    prisma.eventType.create({
      data: {
        uuid: 'ckr179h0p000201l9auo1367o',
        location: 'Google Meet',
        eventLink: '',
        eventColor: '2',
        name: 'Challenge Review',
      },
    }),
    prisma.eventType.create({
      data: {
        uuid: 'ckr179rlr000301l94264fht1',
        location: 'Google Meet',
        eventLink: '',
        eventColor: '3',
        name: 'Final Interview',
      },
    }),
  ])
}
