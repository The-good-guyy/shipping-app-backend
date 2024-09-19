import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RouteService } from 'apps/route_service/src/route/route.service';
import { Booking } from 'apps/route_service/src/booking/entities/booking.entity';
import { Repository } from 'typeorm';
import { BookingStatus } from 'apps/route_service/src/booking/enums/booking-status.enum';
import { ScheduleService } from 'apps/route_service/src/schedule/schedule.service';
import { EErrorMessage } from 'libs/common/error';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterBookingDto } from 'apps/route_service/src/booking/dto/filter-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly routeService: RouteService,
  ) {}
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { routeId } = createBookingDto;
    // const departureDateObj = new Date(departureDate);
    const route = await this.routeService.findOne(routeId);
    if (!route) {
      throw new NotFoundException(EErrorMessage.ROUTE_NOT_FOUND);
    }
    // const travelTime = this.scheduleService.calculateTravelTime(route.distance);
    // const arrivalDate = this.scheduleService.calculateArrivalDate(
    //   // departureDateObj,
    //   travelTime,
    // );
    // console.log(departureDate);
    // console.log(arrivalDate);
    const newBooking = this.bookingRepository.create({
      ...createBookingDto,
      route,
      status: BookingStatus.PENDING,
    });
    // console.log(newBooking);
    const savedBookings = this.bookingRepository.save(newBooking);
    return savedBookings;
  }

  async findAll(query: FilterBookingDto): Promise<any> {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;

    const keyword = (query.search || '').trim().toLowerCase();

    const sortBy = query.sortBy || 'createdAt';
    const order: 'ASC' | 'DESC' =
      query.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.route', 'route');

    if (query.status) {
      const status = query.status.toLowerCase(); // Convert to lowercase
      queryBuilder.andWhere('LOWER(CAST(booking.status AS TEXT)) = :status', {
        status,
      });
    }

    // Search only on string fields like startPort and endPort
    if (keyword) {
      queryBuilder.where(
        '(LOWER(route.startPort) LIKE :keyword OR LOWER(route.endPort) LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // Filter by dates
    if (query.departureDate) {
      queryBuilder.andWhere('booking.departureDate = :departureDate', {
        departureDate: query.departureDate,
      });
    }
    if (query.arrivalDate) {
      queryBuilder.andWhere('booking.arrivalDate = :arrivalDate', {
        arrivalDate: query.arrivalDate,
      });
    }

    // Sorting logic
    switch (sortBy) {
      case 'createdAt':
        queryBuilder.orderBy('booking.createdAt', order);
        break;
      case 'updatedAt':
        queryBuilder.orderBy('booking.updatedAt', order);
        break;
      case 'status':
        queryBuilder.orderBy('booking.status', order);
        break;
      default:
        queryBuilder.orderBy('booking.route', order);
        break;
    }

    queryBuilder.skip(skip).take(limit);
    const [result, total] = await queryBuilder.getManyAndCount();

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: result,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
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
      throw new NotFoundException(EErrorMessage.BOOKING_NOT_FOUND);
    }
  }
}
