import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PermissionObject, PermissionAction } from '../../common/constraints';
import { PermissionIntefrace } from '../entities/permission.interface';
export class udpatePermissionDto
  implements
    Pick<PermissionIntefrace, 'id' | 'permission' | 'action' | 'object'>
{
  @IsNotEmpty()
  @IsString()
  id: string;

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
