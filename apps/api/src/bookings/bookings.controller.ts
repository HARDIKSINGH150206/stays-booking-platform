import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QuoteBookingDto } from './dto/quote-booking.dto';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('stays/:stayId/availability')
  checkAvailability(
    @Param('stayId') stayId: string,
    @Query() query: CheckAvailabilityDto,
  ) {
    return this.bookingsService.checkAvailability(stayId, query);
  }

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @HttpCode(200)
  @HttpCode(200)
  @Post('quote')
  quote(@Body() dto: QuoteBookingDto) {
    return this.bookingsService.quote(dto);
  }
}
