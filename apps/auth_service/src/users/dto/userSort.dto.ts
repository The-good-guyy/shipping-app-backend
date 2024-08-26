import { IsEnum } from 'class-validator';
import { userOrderBy } from '../../common/constants';
import { SortOrder } from '../../common/constants';
export class sortUserDto {
  @IsEnum(userOrderBy)
  orderBy: userOrderBy = userOrderBy.createdAt;

  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.desc;
}
