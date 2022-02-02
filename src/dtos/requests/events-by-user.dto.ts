import { IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../base.dto'

export class EventsByUserDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string
}
