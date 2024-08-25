import { OrderBy } from '../constants';
import { SearchOffsetPaginationDto } from './searchOffsetPagination.dto';
import { IsEnum, IsOptional } from 'class-validator';
export class SearchOffsetDto extends SearchOffsetPaginationDto {
  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy = OrderBy.createdAt;
}
