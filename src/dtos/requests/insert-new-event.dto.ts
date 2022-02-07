import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../base.dto'

export class InsertNewEventDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly calendarId: string

  @IsNotEmpty()
  @IsString()
  readonly summary: string

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  readonly startDatetime: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly candidateEmail: string
}
