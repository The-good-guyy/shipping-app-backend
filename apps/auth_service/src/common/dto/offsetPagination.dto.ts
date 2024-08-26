import { Min } from 'class-validator';

export class OffsetPaginationDto {
  @Min(1)
  limit = 10;

  @Min(1)
  pageNumber = 1;
}
