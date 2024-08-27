import { Min } from 'class-validator';
import { IsInt } from 'class-validator';
export class OffsetPaginationDto {
  @IsInt()
  @Min(1)
  limit = 10;

  @IsInt()
  @Min(1)
  pageNumber = 1;
}
