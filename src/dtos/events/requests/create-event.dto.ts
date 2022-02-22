export class CreateEventDto {
  readonly eventTypeUUID: string
  readonly startDatetime: Date
  readonly endDatetime: Date
  readonly timeZone: string
  readonly inviteeEmail: string
  readonly userUUID: string
  readonly meetingLink: string
}
