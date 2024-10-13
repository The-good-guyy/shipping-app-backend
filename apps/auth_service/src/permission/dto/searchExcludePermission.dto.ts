import { IsUUID, IsOptional } from 'class-validator';
export class SearchExcludePermissionsDto {
  @IsOptional()
  @IsUUID(undefined, { each: true })
  exclude: string[];
}
