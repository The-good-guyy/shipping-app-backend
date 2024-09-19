import { Type } from 'class-transformer';
import { OffsetPaginationDto } from './offsetPagination.dto';
import { OffsetPaginationOptionDto } from './offsetPaginationOption.dto';
import { IsOptional } from 'class-validator';
export class SearchOffsetPaginationDto {
  @Type(() => OffsetPaginationDto)
  pagination: OffsetPaginationDto;

  @IsOptional()
  @Type(() => OffsetPaginationOptionDto)
  options?: OffsetPaginationOptionDto;
}
