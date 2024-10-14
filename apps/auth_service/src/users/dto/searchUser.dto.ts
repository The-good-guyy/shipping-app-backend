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
import { UserInterface } from '../entities/user.interface';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from '../../common/constants';
export class SearchUsersDto
  implements
    PartialPick<
      Pick<UserInterface, 'id' | 'username' | 'email' | 'isVerified'>,
      'id' | 'username' | 'email' | 'isVerified'
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
  username?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  @Transform(({ value }) => {
    // return Boolean(value);
    return value == 'true' || value == 'True';
  })
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsUUID()
  role_id?: string;

  @IsOptional()
  @IsString()
  role_role?: string;

  @IsOptional()
  @IsUUID()
  role_permission_id?: string;

  @IsOptional()
  @IsString()
  role_permission_permission?: string;

  @IsOptional()
  @IsEnum(PermissionAction)
  role_permission_action?: PermissionAction;

  @IsOptional()
  @IsEnum(PermissionObject)
  role_permission_object?: PermissionObject;

  @IsOptional()
  @IsEnum(PermissionPossession)
  role_permission_possession?: PermissionPossession;

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
}
