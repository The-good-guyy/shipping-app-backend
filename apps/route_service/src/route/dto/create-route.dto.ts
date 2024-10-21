import {
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
// class WaypointDto {
//   @IsNumber()
//   @IsNotEmpty()
//   lat: number;

//   @IsNumber()
//   @IsNotEmpty()
//   lon: number;
// }
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
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => WaypointDto)
  // waypoints: WaypointDto[];
}
