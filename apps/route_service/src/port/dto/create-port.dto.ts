import { IsString, IsNumber } from 'class-validator';

export class CreatePortDto {
  @IsString()
  address: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
