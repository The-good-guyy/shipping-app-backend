import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { ScheduleModule } from 'apps/route_service/src/schedule/schedule.module';
import { RouteModule } from 'apps/route_service/src/route/route.module';
@Module({
  imports: [TypeOrmModule.forFeature([Booking]), ScheduleModule, RouteModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
