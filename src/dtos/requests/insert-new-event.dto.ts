import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { EventTypeEnum } from '../../enums/event-type.enum'
import { BaseDto } from '../base.dto'

export class InsertNewEventDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(EventTypeEnum)
  readonly eventType: string

  @IsNotEmpty()
  @IsString()
  readonly timeZone: string

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  readonly startDatetime: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly claimerEmail: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly candidateEmail: string
}
