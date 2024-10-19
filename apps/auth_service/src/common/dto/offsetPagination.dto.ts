import { IsOptional, Min, IsInt } from 'class-validator';
export class OffsetPaginationDto {
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsInt()
  @Min(1)
  pageNumber: number = 1;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;
}
