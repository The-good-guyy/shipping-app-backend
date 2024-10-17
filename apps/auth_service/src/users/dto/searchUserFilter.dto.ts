import {
  IsOptional,
  IsString,
  IsUUID,
  IsEmail,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { IsType } from '../../common/helpers';
import { Gte, Lte, Lt, Gt, Ne, Il, Like } from '../../common/types';
import { PartialPick } from '../../common/types';
import { UserInterface } from '../entities/user.interface';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from '../../common/constants';
export class SearchUsersFilterDto
  implements
    PartialPick<
      Pick<UserInterface, 'id' | 'username' | 'email' | 'isVerified'>,
      'id' | 'username' | 'email' | 'isVerified'
    >
{
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
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
