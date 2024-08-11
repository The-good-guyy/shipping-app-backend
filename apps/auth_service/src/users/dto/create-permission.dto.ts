import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PermissionAction, PermissionObject } from '../../common/constraints';
export class createPermissionDto {
  @IsNotEmpty()
  @IsString()
  permission: string;

  @IsNotEmpty()
  @IsEnum(PermissionAction)
  action: PermissionAction;

  @IsNotEmpty()
  @IsEnum(PermissionObject)
  object: PermissionObject;
}
