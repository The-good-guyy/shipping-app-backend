import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  calculateTravelTime(distance: number): number {
    const speed = 50;
    console.log(distance / speed);
    return distance / speed;
  }
  calculateArrivalDate(departureDate: Date, travelTime: number): Date {
    const arrivalDate = new Date(departureDate);
    arrivalDate.setHours(arrivalDate.getHours() + travelTime);
    return arrivalDate;
  }
}
