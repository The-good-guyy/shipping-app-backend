import { IsEnum } from 'class-validator';
import { PermissionOrderBySearch } from 'libs/common/constants';
import { SortOrder } from 'libs/common/constants';
export class SortPermissionDto {
  @IsEnum(PermissionOrderBySearch)
  orderBy: PermissionOrderBySearch = PermissionOrderBySearch.CREATED_AT;

  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.desc;
}
