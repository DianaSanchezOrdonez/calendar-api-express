import { IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../../base.dto'

export class AccessCodeDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string
}
