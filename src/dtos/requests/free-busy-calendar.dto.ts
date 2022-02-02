import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../base.dto'

export class FreeAndBusyCalendarDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly claimerEmail: string
}
