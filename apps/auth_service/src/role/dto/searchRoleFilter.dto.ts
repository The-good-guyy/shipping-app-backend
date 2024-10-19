import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { IsType } from 'libs/common/helpers';
import { Gte, Lte, Lt, Gt, Ne, Il, Like } from '../../common/types';
import { PartialPick } from '../../common/types';
import { RoleInterface } from '../entities/role.interface';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from 'libs/common/constants';
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
  @IsType([
    'date',
    'gteDate',
    'lteDate',
    'ltDate',
    'gtDate',
    'neDate',
    'ilDate',
    'likeDate',
  ])
  createdAt?:
    | Date
    | Gte<Date>
    | Lte<Date>
    | Lt<Date>
    | Gt<Date>
    | Ne<Date>
    | Il<Date>
    | Like<Date>;

  @IsOptional()
  @IsType([
    'date',
    'gteDate',
    'lteDate',
    'ltDate',
    'gtDate',
    'neDate',
    'ilDate',
    'likeDate',
  ])
  updatedAt?:
    | Date
    | Gte<Date>
    | Lte<Date>
    | Lt<Date>
    | Gt<Date>
    | Ne<Date>
    | Il<Date>
    | Like<Date>;
}
