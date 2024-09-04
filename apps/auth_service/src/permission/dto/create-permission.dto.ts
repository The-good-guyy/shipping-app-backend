import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from '../../common/constants';
import { PermissionInterface } from '../entities/permission.interface';
export class CreatePermissionDto
  implements
    Pick<
      PermissionInterface,
      'permission' | 'action' | 'object' | 'possession'
    >
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

  @IsNotEmpty()
  @IsEnum(PermissionPossession)
  possession: PermissionPossession;
}
