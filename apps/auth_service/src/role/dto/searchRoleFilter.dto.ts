import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { IsType } from '../../common/helpers';
import { Gte, Lte, Lt, Gt } from '../../common/types';
import { PartialPick } from '../../common/types';
import { RoleInterface } from '../entities/role.interface';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from '../../common/constants';
export class SearchRoleFilterDto
  implements PartialPick<Pick<RoleInterface, 'id' | 'role'>, 'id' | 'role'>
{
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsOptional()
  @IsUUID()
  permission_id?: string;

  @IsOptional()
  @IsString()
  permission_permission?: string;

  @IsOptional()
  @IsEnum(PermissionAction)
  permission_action?: PermissionAction;

  @IsOptional()
  @IsEnum(PermissionObject)
  permission_object?: PermissionObject;

  @IsOptional()
  @IsEnum(PermissionPossession)
  permission_possession?: PermissionPossession;

  @IsOptional()
  @IsType(['date', 'gteDate', 'lteDate', 'ltDate', 'gtDate'])
  createdAt?: Date | Gte<Date> | Lte<Date> | Lt<Date> | Gt<Date>;

  @IsOptional()
  @IsType(['date', 'gteDate', 'lteDate', 'ltDate', 'gtDate'])
  updatedAt?: Date | Gte<Date> | Lte<Date> | Lt<Date> | Gt<Date>;
}
