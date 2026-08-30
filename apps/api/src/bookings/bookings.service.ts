import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QuoteBookingDto } from './dto/quote-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAvailability(stayId: string, query: CheckAvailabilityDto) {
    const checkIn = new Date(query.checkIn);
    const checkOut = new Date(query.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('checkOut must be after checkIn');
    }

    const stay = await this.prisma.stay.findUnique({
      where: { id: stayId },
      select: { id: true },
    });

    if (!stay) {
      throw new NotFoundException('Stay not found');
    }

    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        stayId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        checkIn: {
          lt: checkOut,
        },
        checkOut: {
          gt: checkIn,
        },
      },
      select: {
        id: true,
      },
    });

    return {
      available: !conflictingBooking,
    };
  }

  async quote(dto: QuoteBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('checkOut must be after checkIn');
    }

    const stay = await this.prisma.stay.findUnique({
      where: { id: dto.stayId },
      select: {
        id: true,
        pricePerNight: true,
        maxGuests: true,
      },
    });

    if (!stay) {
      throw new NotFoundException('Stay not found');
    }

    if (dto.guests > stay.maxGuests) {
      throw new BadRequestException(
        `Stay allows a maximum of ${stay.maxGuests} guests`,
      );
    }

    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        stayId: dto.stayId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        checkIn: {
          lt: checkOut,
        },
        checkOut: {
          gt: checkIn,
        },
      },
      select: {
        id: true,
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException(
        'Stay is not available for the selected dates',
      );
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / millisecondsPerDay,
    );

    const totalAmount = nights * stay.pricePerNight;

    return {
      stayId: dto.stayId,
      checkIn,
      checkOut,
      guests: dto.guests,
      nights,
      pricePerNight: stay.pricePerNight,
      totalAmount,
    };
  }

  async getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        stay: true,
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(userId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('checkOut must be after checkIn');
    }

    return this.prisma.$transaction(async (tx) => {
      const [user, stay] = await Promise.all([
        tx.user.findUnique({
          where: { id: userId },
          select: { id: true },
        }),

        tx.stay.findUnique({
          where: { id: dto.stayId },
          select: {
            id: true,
            pricePerNight: true,
            maxGuests: true,
          },
        }),
      ]);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!stay) {
        throw new NotFoundException('Stay not found');
      }

      if (dto.guests > stay.maxGuests) {
        throw new BadRequestException(
          `Stay allows a maximum of ${stay.maxGuests} guests`,
        );
      }

      /*
       * Lock the stay row for the duration of this transaction.
       *
       * This serializes booking creation attempts for the same stay,
       * preventing two concurrent requests from both passing the
       * availability check before either one creates a booking.
       */
      await tx.$queryRaw`
      SELECT id
      FROM "Stay"
      WHERE id = ${dto.stayId}
      FOR UPDATE
    `;

      const conflictingBooking = await tx.booking.findFirst({
        where: {
          stayId: dto.stayId,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
          checkIn: {
            lt: checkOut,
          },
          checkOut: {
            gt: checkIn,
          },
        },
        select: {
          id: true,
        },
      });

      if (conflictingBooking) {
        throw new BadRequestException(
          'Stay is not available for the selected dates',
        );
      }

      const millisecondsPerDay = 1000 * 60 * 60 * 24;

      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / millisecondsPerDay,
      );

      const totalAmount = nights * stay.pricePerNight;

      return tx.booking.create({
        data: {
          userId,
          stayId: dto.stayId,
          checkIn,
          checkOut,
          guests: dto.guests,
          totalAmount,
          status: 'PENDING',
        },
      });
    });
  }
}
