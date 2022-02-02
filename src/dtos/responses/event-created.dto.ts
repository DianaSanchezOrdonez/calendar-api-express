import { Exclude, Expose } from 'class-transformer'
import { calendar_v3 as Calendar } from 'googleapis'

@Exclude()
export class EventCreatedDto {
  @Expose()
  data: Calendar.Schema$Event
}
