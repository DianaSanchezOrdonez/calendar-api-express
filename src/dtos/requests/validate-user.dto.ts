import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../base.dto'

export class ValidateUserDto extends BaseDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string
}
