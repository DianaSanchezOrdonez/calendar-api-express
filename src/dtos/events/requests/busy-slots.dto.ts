import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../../base.dto'

export class BusySlotsDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  readonly timeZone: string
}
