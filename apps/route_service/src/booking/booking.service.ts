import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RouteService } from 'apps/route_service/src/route/route.service';
import { Booking } from 'apps/route_service/src/booking/entities/booking.entity';
import { Repository } from 'typeorm';
import { BookingStatus } from 'apps/route_service/src/booking/enums/booking-status.enum';
import { ScheduleService } from 'apps/route_service/src/schedule/schedule.service';
import { EErrorMessage } from 'libs/common/error';

@Injectable()
export class BookingService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly routeService: RouteService,
    private readonly bookingRepository: Repository<Booking>,
  ) {}
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { routeId, departureDate } = createBookingDto;
    const route = await this.routeService.findOne(routeId);
    if (!route) {
      throw new NotFoundException('Route not found');
    }
    const travelTime = this.scheduleService.calculateTravelTime(route.distance);
    const arrivalDate = this.scheduleService.calculateArrivalDate(
      departureDate,
      travelTime,
    );

    // const newBooking = new Booking();
    // newBooking.route = route;
    // newBooking.status = BookingStatus.PENDING;
    const newBooking = this.bookingRepository.create({
      ...createBookingDto,
      route,
      travelTime,
      arrivalDate,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepository.save(newBooking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(EErrorMessage.BOOKING_NOT_FOUND);
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.preload({
      id,
      ...updateBookingDto,
    });

    if (!booking) {
      throw new NotFoundException(EErrorMessage.BOOKING_NOT_FOUND);
    }

    return this.bookingRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Booking not found');
    }
  }
}
