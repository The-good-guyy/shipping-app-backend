import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RouteService } from 'apps/route_service/src/route/route.service';
import { Booking } from 'apps/route_service/src/booking/entities/booking.entity';
import { Repository } from 'typeorm';
import { BookingStatus } from 'apps/route_service/src/booking/enums/booking-status.enum';
import { EErrorMessage } from 'libs/common/error';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterBookingDto } from 'apps/route_service/src/booking/dto/filter-booking.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

interface UsersService {
  getUser(data: {
    id: string;
  }): Observable<{ id: string; isVerified: boolean }>;
}
@Injectable()
// @UseInterceptors(ClassSerializerInterceptor)
export class BookingService implements OnModuleInit {
  private usersService: UsersService;
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly routeService: RouteService,
    @Inject('USER_PACKAGE') private readonly grpcClient: ClientGrpc,
  ) {}
  onModuleInit() {
    this.usersService =
      this.grpcClient.getService<UsersService>('UsersService');
  }

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    let userResponse: {
      id: string;
      isVerified: boolean;
    };
    try {
      userResponse = await firstValueFrom(
        this.usersService.getUser({ id: userId }),
      );
      // console.log(userResponse);
    } catch (error) {
      console.error('Failed to retrieve user via gRPC:', error);
      throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    }
    if (!userResponse.isVerified) {
      console.log('User is not verified and cannot create a booking.');
      throw new BadRequestException(
        'User is not verified and cannot create a booking.',
      );
    }
    if (!userResponse || !userResponse.id) {
      throw new NotFoundException('User not found');
    }
    const { routeId } = createBookingDto;
    const route = await this.routeService.findOne(routeId);
    if (!route) {
      throw new NotFoundException(EErrorMessage.ROUTE_NOT_FOUND);
    }

    if (route.status !== 'Available') {
      throw new BadRequestException(
        `Route is currently ${route.status.toLowerCase()} and cannot be booked.`,
      );
    }

    const newBooking = this.bookingRepository.create({
      ...createBookingDto,
      route,
      userId: userResponse.id,
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
  async getBookingHistory(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId }, 
      relations: ['route'], 
    });
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
