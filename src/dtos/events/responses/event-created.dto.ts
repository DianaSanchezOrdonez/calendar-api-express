import { Exclude, Expose, Type } from 'class-transformer'

export class DateAndTimeZoneDto {
  readonly dateTime: string
  readonly timeZone: string
}

export class ActorDto {
  readonly email: string
  readonly self: boolean
}

@Exclude()
export class EventCreatedDataDto {
  @Expose()
  readonly id: string
  @Expose()
  readonly summary: string
  @Expose()
  readonly start: DateAndTimeZoneDto
  @Expose()
  readonly end: DateAndTimeZoneDto
  @Expose()
  readonly hangoutLink: string
  @Expose()
  readonly creator: ActorDto
  @Expose()
  readonly organizer: ActorDto
}

@Exclude()
export class EventCreatedDto {
  @Expose()
  @Type(() => EventCreatedDataDto)
  readonly data: EventCreatedDataDto
}
