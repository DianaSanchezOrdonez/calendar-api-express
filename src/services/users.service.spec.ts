import faker from '@faker-js/faker'
import { User } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import { NotFound, UnprocessableEntity } from 'http-errors'
import { CreateUserDto } from '../dtos/users/requests/create-user.dto'
import { clearDatabase, prisma } from '../prisma'
import { UserFactory } from '../utils/factories/user.factory'
import { UsersService } from './users.service'

jest.spyOn(console, 'error').mockImplementation(jest.fn())

describe('UserService', () => {
  let userFactory: UserFactory

  beforeAll(() => {
    userFactory = new UserFactory(prisma)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect()
  })

  describe('create', () => {
    it('should throw an error if the user already exists', async () => {
      const email = faker.internet.email()
      await userFactory.make({ email })
      const data = plainToClass(CreateUserDto, {
        fullName: faker.name.findName(),
        email,
        picture: faker.image.imageUrl(),
        refreshToken: faker.internet.password(),
      })

      await expect(UsersService.create(data)).rejects.toThrowError(
        new UnprocessableEntity('email already taken'),
      )
    })

    it('should create a new user', async () => {
      const spyOnLogger = jest.spyOn(console, 'error')
      const data = plainToClass(CreateUserDto, {
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        picture: faker.image.imageUrl(),
        refreshToken: faker.internet.password(),
      })

      const result = await UsersService.create(data)

      expect(result).toHaveProperty('uuid', result.uuid)
      expect(result).toHaveProperty('fullName', data.fullName)
      expect(result).toHaveProperty('email', data.email)
      expect(spyOnLogger).not.toHaveBeenCalled()
    })
  })

  describe('findOneByEmail', () => {
    let user: User

    beforeAll(async () => {
      user = await userFactory.make()
    })

    it('should throw an error if the user does not exist', async () => {
      await expect(
        UsersService.findOneByEmail(faker.internet.email()),
      ).rejects.toThrowError(new NotFound('No User found'))
    })

    it('should return the user', async () => {
      const result = await UsersService.findOneByEmail(user.email)

      expect(result).toHaveProperty('uuid', user.uuid)
    })
  })
})
