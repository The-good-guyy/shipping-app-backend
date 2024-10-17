import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  calculateTravelTime(distance: number): number {
    const speed = 30; // km/h
    const hours = distance / speed;
    const days = hours / 24;
    const roundedDays = Math.ceil(days);
    console.log(roundedDays);
    return roundedDays;
  }

  calculateArrivalDate(departureDate: Date, travelTime: number): Date {
    const arrivalDate = new Date(departureDate);
    arrivalDate.setDate(arrivalDate.getDate() + travelTime);
    console.log(arrivalDate + ' arrival');
    return arrivalDate;
  }
}
