import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../base.dto'

export class EncodeDataDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string
  @IsNotEmpty()
  @IsString()
  readonly event: string
  @IsNotEmpty()
  @IsString()
  readonly duration: string
}
