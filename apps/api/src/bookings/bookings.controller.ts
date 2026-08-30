import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QuoteBookingDto } from './dto/quote-booking.dto';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyBookings(@CurrentUser() user: AuthenticatedUser) {
    return this.bookingsService.getMyBookings(user.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.sub, dto);
  }

  @Post('quote')
  quote(@Body() dto: QuoteBookingDto) {
    return this.bookingsService.quote(dto);
  }
}
