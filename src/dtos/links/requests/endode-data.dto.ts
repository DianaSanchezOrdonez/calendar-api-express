import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../../base.dto'

export class EncodeDataDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly inviterUUID: string

  @IsNotEmpty()
  @IsString()
  readonly inviteeUUID: string

  @IsNotEmpty()
  @IsString()
  readonly eventTypeUUID: string
}
