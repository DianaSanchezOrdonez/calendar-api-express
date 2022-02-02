import { Exclude, Expose } from 'class-transformer'
import { calendar_v3 as Calendar } from 'googleapis'

class RemindersDto {
  readonly method: string
  readonly minutes: number
}

@Exclude()
export class EventsByUserResponseDto {
  @Expose()
  data: {
    readonly kind: 'calendar#events'
    readonly etag: string
    readonly summary: string
    readonly description: string
    readonly updated: Date
    readonly timeZone: string
    readonly accessRole: string
    readonly defaultReminders: RemindersDto[]
    readonly nextPageToken: string
    readonly nextSyncToken: string
    readonly items: Calendar.Schema$Event[]
  }
}
