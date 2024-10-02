import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterPortDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'address'])
  sortBy?: 'createdAt' | 'updatedAt' | 'address';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
