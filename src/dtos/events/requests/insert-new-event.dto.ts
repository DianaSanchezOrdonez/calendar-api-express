import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator'
import { EventTypeEnum } from '../../../enums/event-type.enum'
import { BaseDto } from '../../base.dto'

export class InsertNewEventDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly timeZone: string

  @IsNotEmpty()
  @IsString()
  @IsEnum(EventTypeEnum)
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
