import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PermissionObject, PermissionAction } from '../../common/constants';
import { PermissionInterface } from '../entities/permission.interface';
export class UdpatePermissionDto
  implements
    Pick<PermissionInterface, 'id' | 'permission' | 'action' | 'object'>
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
