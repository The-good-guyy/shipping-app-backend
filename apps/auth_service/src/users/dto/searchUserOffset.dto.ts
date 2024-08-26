import { userOrderBy } from '../../common/constants';
import { SearchOffsetPaginationDto } from '../../common/dto/searchOffsetPagination.dto';
import { IsEnum, IsOptional } from 'class-validator';
export class SearchUserOffsetDto extends SearchOffsetPaginationDto {
  @IsOptional()
  @IsEnum(userOrderBy)
  orderBy?: userOrderBy = userOrderBy.createdAt;
}
