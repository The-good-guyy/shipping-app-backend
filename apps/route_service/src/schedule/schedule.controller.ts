import { Controller, Get, Query } from '@nestjs/common';
import { ScheduleService } from 'apps/route_service/src/schedule/schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('travel-time')
  calculateTravelTime(@Query('distance') distance: number): number {
    return this.scheduleService.calculateTravelTime(Number(distance));
  }

  @Get('arrival-date')
  calculateArrivalDate(
    @Query('departureDate') departureDate: string,
    @Query('travelTime') travelTime: number,
  ): Date {
    const parsedDate = new Date(departureDate);
    return this.scheduleService.calculateArrivalDate(
      parsedDate,
      Number(travelTime),
    );
  }
}
