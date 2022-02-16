import { PrismaClient } from '.prisma/client'
import { eventTypesSeed } from './seeds'

const prisma = new PrismaClient()

async function main() {
  await Promise.all([eventTypesSeed(prisma)])
  await prisma.$disconnect()
  console.log('database seeded')
}

main().catch((e) => {
  console.log(e)
  process.exit(1)
})
