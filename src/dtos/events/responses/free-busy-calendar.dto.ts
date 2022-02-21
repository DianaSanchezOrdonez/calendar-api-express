import { Exclude, Expose, Type } from 'class-transformer'
class BusyTimeDto {
  readonly start: string
  readonly end: string
}

class UserBusyEventDto {
  readonly primary: {
    readonly busy: BusyTimeDto[]
  }
}
@Exclude()
class FreeBusyDataDto {
  @Expose()
  @Type(() => UserBusyEventDto)
  readonly calendars: UserBusyEventDto
}
@Exclude()
export class FreeBusyResponseDto {
  @Expose()
  @Type(() => FreeBusyDataDto)
  readonly data: FreeBusyDataDto
}
