import faker from '@faker-js/faker'
import { Invitee } from '@prisma/client'
import { NotFound, UnprocessableEntity } from 'http-errors'
import { clearDatabase, prisma } from '../prisma'
import { InviteeFactory } from '../utils/factories/invitee.factory'
import { InviteesService } from './invitees.service'

jest.spyOn(console, 'error').mockImplementation(jest.fn())

describe('InviteeService', () => {
  let inviteeFactory: InviteeFactory

  beforeAll(() => {
    inviteeFactory = new InviteeFactory(prisma)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect()
  })

  describe('findOne', () => {
    let invitee: Invitee

    beforeAll(async () => {
      invitee = await inviteeFactory.make()
    })

    it('should throw an error if the invitee does not exist', async () => {
      await expect(
        InviteesService.findOne({ email: faker.internet.email() }),
      ).rejects.toThrowError(new NotFound('No Invitee found'))
    })

    it('should return the event type', async () => {
      const result = await InviteesService.findOne({ email: invitee.email })

      expect(result).toHaveProperty('uuid', invitee.uuid)
    })
  })

  describe('create', () => {
    let invitee: Invitee

    beforeAll(async () => {
      invitee = await inviteeFactory.make()
    })

    it("should throw an error if the invitee's email already exists", async () => {
      await expect(InviteesService.create(invitee.email)).rejects.toThrowError(
        new UnprocessableEntity('email already taken'),
      )
    })

    it('should create a new invitee', async () => {
      const result = await InviteesService.create(faker.internet.email())

      expect(result).toHaveProperty('uuid', result.uuid)
    })
  })
})
