import { IsEnum } from 'class-validator';
import { UserOrderBySearch } from '../../common/constants';
import { SortOrder } from '../../common/constants';
export class SortUserDto {
  @IsEnum(UserOrderBySearch)
  orderBy: UserOrderBySearch = UserOrderBySearch.createdAt;

  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.desc;
}
