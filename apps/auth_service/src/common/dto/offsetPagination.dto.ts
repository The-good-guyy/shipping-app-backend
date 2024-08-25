import { SortOrder } from '../constants';
import { Min, IsEnum } from 'class-validator';

export class OffsetPaginationDto {
  @Min(1)
  limit = 10;

  @Min(1)
  pageNumber = 1;

  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.desc;
}
