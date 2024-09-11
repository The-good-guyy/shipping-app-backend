import { PartialType } from '@nestjs/mapped-types';
import { BookingStatus } from 'apps/route_service/src/booking/enums/booking-status.enum';
import { IsEnum } from 'class-validator';
export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
