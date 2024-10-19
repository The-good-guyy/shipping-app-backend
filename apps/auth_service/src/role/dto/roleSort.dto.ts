import { IsEnum } from 'class-validator';
import { RoleOrderBySearch } from '../../common/constants';
import { SortOrder } from '../../common/constants';
export class SortRoleDto {
  @IsEnum(RoleOrderBySearch)
  orderBy: RoleOrderBySearch = RoleOrderBySearch.CREATED_AT;

  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.desc;
}
