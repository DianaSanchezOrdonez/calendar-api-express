import { Exclude, Expose, Type } from 'class-transformer'

@Exclude()
export class EventItemsDto {
  @Expose()
  readonly start: {
    dateTime: string
    timeZone: string
  }
  @Expose()
  readonly end: {
    dateTime: string
    timeZone: string
  }
  // @Expose()
  // readonly hangoutLink: string
}

@Exclude()
class EventDataDto {
  @Expose()
  @Type(() => EventItemsDto)
  readonly items: EventItemsDto[]
}

@Exclude()
export class EventsByUserResponseDto {
  @Expose()
  @Type(() => EventDataDto)
  readonly data: EventDataDto
}
