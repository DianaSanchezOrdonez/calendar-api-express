import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { BaseDto } from '../../base.dto'

export class InsertNewEventDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly hash: string

  @IsOptional()
  @IsString()
  @IsEmail()
  readonly inviteeEmail?: string

  @IsNotEmpty()
  @IsString()
  readonly timeZone: string

  @IsNotEmpty()
  @IsDateString()
  readonly startDatetime: string
}
