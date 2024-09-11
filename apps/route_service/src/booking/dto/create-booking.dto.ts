import { BookingStatus } from 'apps/route_service/src/booking/enums/booking-status.enum';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDate 
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsUUID('all', { message: 'routeId must be a valid UUID' })
  routeId: string;

  @IsOptional()
  @IsString()
  userId?: string;
  @IsDate()
  departureDate: Date;
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
