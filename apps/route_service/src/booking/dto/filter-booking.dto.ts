import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsDate,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from 'apps/route_service/src/booking/enums/booking-status.enum';
import { Transform } from 'class-transformer';
export class FilterBookingDto {
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
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(Object.values(BookingStatus))
  search?: string;

  @IsOptional()
  @IsString()
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'status'])
  sortBy?: 'createdAt' | 'updatedAt' | 'status';

  @IsOptional()
  @IsDate()
  departureDate?: Date;

  @IsOptional()
  @IsDate()
  arrivalDate?: Date;
}
