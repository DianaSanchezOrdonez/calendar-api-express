import { IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../../base.dto'

export class HashDataDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly hash: string
}
