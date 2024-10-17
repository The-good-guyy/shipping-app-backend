import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FilterBookingDto } from 'apps/route_service/src/booking/dto/filter-booking.dto';
import { Booking } from 'apps/route_service/src/booking/entities/booking.entity';
import { AtCookieGuard, VerifiedGuard } from 'libs/common/guard';
import { GetCurrentUser } from 'libs/common/decorators';
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AtCookieGuard, VerifiedGuard)
  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @GetCurrentUser('sub') userId: string,
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

  @UseGuards(AtCookieGuard, VerifiedGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @UseGuards(AtCookieGuard, VerifiedGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
