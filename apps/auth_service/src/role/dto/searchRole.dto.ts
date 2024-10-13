import { Gte, Lt, Lte, Gt } from '../../common/types';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { IsType } from '../../common/helpers';
import { PartialPick } from '../../common/types';
import { RoleInterface } from '../entities/role.interface';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from '../../common/constants';
export class SearchRoleDto
  implements PartialPick<Pick<RoleInterface, 'id' | 'role'>, 'id' | 'role'>
{
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  skip?: number;

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
  @Transform(({ value }) => {
    if (typeof value === 'string') return new Date(value);
    if (value.gte) value.gte = new Date(value.gte);
    if (value.lte) value.lte = new Date(value.lte);
    if (value.gt) value.gt = new Date(value.gt);
    if (value.lt) value.lt = new Date(value.lt);
    return value;
  })
  @IsType(['date', 'gteDate', 'lteDate', 'ltDate', 'gtDate'])
  createdAt?: Date | Gte<Date> | Lte<Date> | Lt<Date> | Gt<Date>;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return new Date(value);
    if (value.gte) value.gte = new Date(value.gte);
    if (value.lte) value.lte = new Date(value.lte);
    if (value.gt) value.gt = new Date(value.gt);
    if (value.lt) value.lt = new Date(value.lt);
    return value;
  })
  @IsType(['date', 'gteDate', 'lteDate', 'ltDate', 'gtDate'])
  updatedAt?: Date | Gte<Date> | Lte<Date> | Lt<Date> | Gt<Date>;
}
