import { Gte, Lt, Lte, Gt } from '../../common/types';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { IsType } from 'libs/common/helpers';
import { PermissionInterface } from '../entities/permission.interface';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from 'libs/common/constants';
import { PartialPick } from '../../common/types';
export class SearchPermissionsDto
  implements
    PartialPick<
      Pick<
        PermissionInterface,
        'permission' | 'action' | 'object' | 'possession'
      >,
      'permission' | 'action' | 'object' | 'possession'
    >
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
  permission?: string;

  @IsOptional()
  @IsEnum(PermissionAction)
  action: PermissionAction;

  @IsOptional()
  @IsEnum(PermissionObject)
  object: PermissionObject;

  @IsOptional()
  @IsEnum(PermissionPossession)
  possession: PermissionPossession;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return new Date(value);
    if (value.gte) value.gte = new Date(value.gte);
    if (value.lte) value.lte = new Date(value.lte);
    if (value.gt) value.gt = new Date(value.gt);
    return value;
  })
  @IsType(['date', 'gteDate', 'lteDate', 'ltDate', 'gtDate'])
  createdAt?: Date | Gte<Date> | Lte<Date> | Lt<Date> | Gt<Date>;

  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? new Date(value) : value;
  })
  @IsType(['date', 'gteDate', 'lteDate', 'ltDate', 'gtDate'])
  updatedAt?: Date | Gte<Date> | Lte<Date> | Lt<Date> | Gt<Date>;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  fields?: string;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return value == 'true' || value == 'True';
  })
  @IsBoolean()
  getAll?: boolean;

  @IsOptional()
  @IsUUID()
  role_id?: string;

  @IsOptional()
  @IsString()
  role_role?: string;
}
