import { IsEnum } from 'class-validator';
import { UserOrderBySearch } from 'libs/common/constants';
import { SortOrder } from 'libs/common/constants';
export class SortUserDto {
  @IsEnum(UserOrderBySearch)
  orderBy: UserOrderBySearch = UserOrderBySearch.CREATED_AT;

  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.desc;
}
