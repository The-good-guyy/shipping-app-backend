import { IsBoolean, ValidateIf, IsOptional } from 'class-validator';
export class OffsetPaginationOptionDto {
  @IsOptional()
  @IsBoolean()
  @ValidateIf((_, value) => value !== null)
  isGetAll?: boolean | null;
}
