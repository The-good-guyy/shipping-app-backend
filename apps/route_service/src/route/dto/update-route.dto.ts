import { IsOptional, IsUUID, IsNumber } from 'class-validator';

export class UpdateRouteDto {
  @IsOptional()
  @IsUUID()
  startPort_id?: string;

  @IsOptional()
  @IsUUID()
  endPort_id?: string;

  @IsOptional()
  @IsNumber()
  distance?: number;
}
