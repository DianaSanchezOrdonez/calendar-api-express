import { IsNotEmpty, IsString } from 'class-validator'
import { BaseDto } from '../../base.dto'

export class GetEventTypeDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  readonly eventName: string
}
