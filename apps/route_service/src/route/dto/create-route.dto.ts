import { IsNotEmpty, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateRouteDto {
  @IsNotEmpty()
  @IsString()
  startPort_address: string;

  @IsNotEmpty()
  @IsString()
  endPort_address: string;

  @IsNumber()
  @IsNotEmpty()
  distance: number;
  @IsDate()
  departureDate: Date;
}
