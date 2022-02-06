import { Exclude, Expose, Type } from 'class-transformer'

export class DateAndTimeZoneDto {
  readonly dateTime: string
  readonly timeZone: string
}

@Exclude()
export class EventCreatedDataDto {
  @Expose()
  readonly id: string
  @Expose()
  readonly summary: string
  @Expose()
  readonly creator: {
    email: 'diana@ravn.co'
  }
  @Expose()
  readonly start: DateAndTimeZoneDto
  @Expose()
  readonly end: DateAndTimeZoneDto
  @Expose()
  readonly hangoutLink: string
}

@Exclude()
export class EventCreatedDto {
  @Expose()
  @Type(() => EventCreatedDataDto)
  readonly data: EventCreatedDataDto
}
