import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator'
import { BaseDto } from '../../base.dto'

export class InsertNewEventDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly timeZone: string

  @IsNotEmpty()
  @IsString()
  readonly eventName: string

  @IsNotEmpty()
  @IsDateString()
  readonly startDatetime: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly inviteeEmail: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly inviterEmail: string
}
