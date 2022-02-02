import { IsNotEmpty, IsString, IsEnum } from 'class-validator'
import { AccessControlRoleEnum } from '../../enums/access-control-role.enum'
import { BaseDto } from '../base.dto'

export class AccessControlRuleDto extends BaseDto {
  @IsNotEmpty()
  @IsEnum(AccessControlRoleEnum)
  readonly role: AccessControlRoleEnum
}
