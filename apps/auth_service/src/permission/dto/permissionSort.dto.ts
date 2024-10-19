import { IsEnum } from 'class-validator';
import { PermissionOrderBySearch } from '../../common/constants';
import { SortOrder } from '../../common/constants';
export class SortPermissionDto {
  @IsEnum(PermissionOrderBySearch)
  orderBy: PermissionOrderBySearch = PermissionOrderBySearch.CREATED_AT;

  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.desc;
}
