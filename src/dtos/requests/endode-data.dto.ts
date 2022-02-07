import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
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
  readonly event: string
  @IsNotEmpty()
  @IsString()
  readonly duration: string
}
