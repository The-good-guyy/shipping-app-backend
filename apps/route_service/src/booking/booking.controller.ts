import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FilterBookingDto } from 'apps/route_service/src/booking/dto/filter-booking.dto';
import { Booking } from 'apps/route_service/src/booking/entities/booking.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Body('userId') userId: string,
  ) {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get()
  findAll(@Query() query: FilterBookingDto): Promise<Booking[]> {
    return this.bookingService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  //guard to check authorized
  // @UseGuards(JwtAuthGuard)
  @Get('history/:userId')
  async getBookingHistory(
    @Param('userId') userId: string,
    @Request() req: any,
  ) {
    if (req.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this booking history.',
      );
    }
    return this.bookingService.getBookingHistory(userId);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
