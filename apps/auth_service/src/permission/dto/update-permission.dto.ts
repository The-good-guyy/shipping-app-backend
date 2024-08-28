import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import { PermissionObject, PermissionAction } from '../../common/constants';
import { PermissionInterface } from '../entities/permission.interface';
export class UdpatePermissionDto
  implements
    Pick<PermissionInterface, 'id' | 'permission' | 'action' | 'object'>
{
  @IsNotEmpty()
  @IsUUID()
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
