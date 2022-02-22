import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class EventIsertedDto {
  @Expose()
  readonly uuid: string
  @Expose()
  readonly inviteeEmail: string
  @Expose()
  readonly meetingLink: string
  @Expose()
  readonly timeZone: string
  @Expose()
  readonly meetingStart: Date
  @Expose()
  readonly meetingFinish: Date
  @Expose()
  readonly userId: number
  @Expose()
  readonly inviteeId: number
  @Expose()
  readonly eventTypeId: number
  @Expose()
  readonly createdAt: Date
}
