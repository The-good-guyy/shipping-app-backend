import { Gte, Lt, Lte, Gt } from '../../common/types';
import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { IsType } from '../../common/helpers';
import { PermissionInterface } from '../entities/permission.interface';
import {
  PermissionAction,
  PermissionObject,
  PermissionPossession,
} from '../../common/constants';
import { PartialPick } from '../../common/types';
export class SearchPermissionsFilterDto
  implements
    PartialPick<
      Pick<
        PermissionInterface,
        'permission' | 'action' | 'object' | 'possession'
      >,
      'permission' | 'action' | 'object' | 'possession'
    >
{
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
  @IsType(['date', 'gteDate', 'lteDate', 'ltDate', 'gtDate'])
  createdAt?: Date | Gte<Date> | Lte<Date> | Lt<Date> | Gt<Date>;

  @IsOptional()
  @IsType(['date', 'gteDate', 'lteDate', 'ltDate', 'gtDate'])
  updatedAt?: Date | Gte<Date> | Lte<Date> | Lt<Date> | Gt<Date>;

  @IsOptional()
  @IsUUID()
  role_id?: string;

  @IsOptional()
  @IsString()
  role_role?: string;
}
