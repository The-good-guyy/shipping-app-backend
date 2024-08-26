import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateRouteDto {
  @IsNotEmpty()
  @IsUUID()
  startPort_id: string;

  @IsNotEmpty()
  @IsUUID()
  endPort_id: string;

  @IsNumber()
  @IsNotEmpty()
  distance: number;
}
