import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PermissionAction, PermissionObject } from '../../common/constants';
import { PermissionInterface } from '../entities/permission.interface';
export class CreatePermissionDto
  implements Pick<PermissionInterface, 'permission' | 'action' | 'object'>
{
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
