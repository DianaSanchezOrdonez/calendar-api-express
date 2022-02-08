import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { EventTypeEnum } from '../../enums/event-type.enum'
import { BaseDto } from '../base.dto'

export class EncodeDataDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly claimerEmail: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly candidateEmail: string

  @IsNotEmpty()
  @IsString()
  @IsEnum(EventTypeEnum)
  readonly eventName: string

  @IsNotEmpty()
  @IsString()
  readonly duration: string
}
