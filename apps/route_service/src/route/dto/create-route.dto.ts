import { IsNotEmpty, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateRouteDto {
  @IsNotEmpty()
  @IsString()
  startPort_id: string;

  @IsNotEmpty()
  @IsString()
  endPort_id: string;

  @IsNumber()
  @IsNotEmpty()
  distance: number;
  @IsDate()
  departureDate: Date;
}
