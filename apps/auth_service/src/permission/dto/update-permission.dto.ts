import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import {
  PermissionObject,
  PermissionAction,
  PermissionPossession,
} from 'libs/common/constants';
import { PermissionInterface } from '../entities/permission.interface';
export class UdpatePermissionDto
  implements
    Pick<
      PermissionInterface,
      'id' | 'permission' | 'action' | 'object' | 'possession'
    >
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

  @IsNotEmpty()
  @IsEnum(PermissionPossession)
  possession: PermissionPossession;
}
