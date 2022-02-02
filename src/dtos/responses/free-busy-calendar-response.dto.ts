import { Exclude, Expose } from 'class-transformer'

class ErrorsDto {
  readonly domain: string
  readonly reason: string
}

class BusyTimeDto {
  readonly start: string
  readonly end: string
}

@Exclude()
export class FreeBusyResponseDto {
  @Expose()
  data: {
    readonly kind: string
    readonly timeMin: string
    readonly timeMax: string
    readonly groups: {
      '(key)': {
        errors: ErrorsDto[]
        calendars: [string]
      }
    }
    readonly calendars: {
      '(key)': {
        errors: ErrorsDto[]
        busy: BusyTimeDto[]
      }
    }
  }
}
