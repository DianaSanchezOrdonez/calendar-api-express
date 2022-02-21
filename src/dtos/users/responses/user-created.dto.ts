import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class UserCreatedDto {
  @Expose()
  readonly uuid: string
  @Expose()
  readonly fullName: string
  @Expose()
  readonly email: string
  @Expose()
  readonly picture: string
  @Expose()
  readonly refreshToken: string
  @Expose()
  readonly organizationId?: number
  @Expose()
  readonly createdAt: string
}
