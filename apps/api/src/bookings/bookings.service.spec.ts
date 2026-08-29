import { jest } from '@jest/globals';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookingsService', () => {
  let service: BookingsService;

  const txMock = {
    stay: {
      findUnique: jest.fn<() => Promise<unknown>>(),
    },
    booking: {
      findFirst: jest.fn<() => Promise<unknown>>(),
      create: jest.fn<() => Promise<unknown>>(),
    },
    user: {
      findUnique: jest.fn<() => Promise<unknown>>(),
    },
    $queryRaw: jest.fn<() => Promise<unknown>>(),
  };

  const prismaMock = {
    stay: {
      findUnique: jest.fn<() => Promise<unknown>>(),
    },
    booking: {
      findFirst: jest.fn<() => Promise<unknown>>(),
      create: jest.fn<() => Promise<unknown>>(),
    },
    user: {
      findUnique: jest.fn<() => Promise<unknown>>(),
    },
    $transaction: jest.fn(
      async (
        callback: (tx: typeof txMock) => Promise<unknown>,
      ) => callback(txMock),
    ),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    txMock.user.findUnique.mockResolvedValue({
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    });

    txMock.stay.findUnique.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      pricePerNight: 4500,
      maxGuests: 4,
    });

    txMock.booking.findFirst.mockResolvedValue(null);

    txMock.booking.create.mockResolvedValue({
      id: 'booking-1',
      userId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      stayId: '11111111-1111-4111-8111-111111111111',
      checkIn: new Date('2026-09-10T00:00:00.000Z'),
      checkOut: new Date('2026-09-13T00:00:00.000Z'),
      guests: 2,
      totalAmount: 13500,
      status: 'PENDING',
    });

    txMock.$queryRaw.mockResolvedValue([]);

    service = new BookingsService(
      prismaMock as unknown as PrismaService,
    );
  });

  describe('checkAvailability', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return available when there is no conflicting booking', async () => {
      prismaMock.stay.findUnique.mockResolvedValue({
        id: 'stay-1',
      });

      prismaMock.booking.findFirst.mockResolvedValue(null);

      await expect(
        service.checkAvailability('stay-1', {
          checkIn: '2026-09-10T00:00:00.000Z',
          checkOut: '2026-09-12T00:00:00.000Z',
        }),
      ).resolves.toEqual({
        available: true,
      });
    });

    it('should return unavailable when a booking overlaps', async () => {
      prismaMock.stay.findUnique.mockResolvedValue({
        id: 'stay-1',
      });

      prismaMock.booking.findFirst.mockResolvedValue({
        id: 'booking-1',
      });

      await expect(
        service.checkAvailability('stay-1', {
          checkIn: '2026-09-10T00:00:00.000Z',
          checkOut: '2026-09-12T00:00:00.000Z',
        }),
      ).resolves.toEqual({
        available: false,
      });
    });

    it('should allow a back-to-back booking', async () => {
      prismaMock.stay.findUnique.mockResolvedValue({
        id: 'stay-1',
      });

      prismaMock.booking.findFirst.mockResolvedValue(null);

      await service.checkAvailability('stay-1', {
        checkIn: '2026-09-12T00:00:00.000Z',
        checkOut: '2026-09-15T00:00:00.000Z',
      });

      expect(prismaMock.booking.findFirst).toHaveBeenCalledWith({
        where: {
          stayId: 'stay-1',
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
          checkIn: {
            lt: new Date('2026-09-15T00:00:00.000Z'),
          },
          checkOut: {
            gt: new Date('2026-09-12T00:00:00.000Z'),
          },
        },
        select: {
          id: true,
        },
      });
    });

    it('should reject an invalid date range', async () => {
      await expect(
        service.checkAvailability('stay-1', {
          checkIn: '2026-09-15T00:00:00.000Z',
          checkOut: '2026-09-10T00:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prismaMock.stay.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.booking.findFirst).not.toHaveBeenCalled();
    });

    it('should reject equal check-in and check-out dates', async () => {
      await expect(
        service.checkAvailability('stay-1', {
          checkIn: '2026-09-10T00:00:00.000Z',
          checkOut: '2026-09-10T00:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw when the stay does not exist', async () => {
      prismaMock.stay.findUnique.mockResolvedValue(null);

      await expect(
        service.checkAvailability('missing-stay', {
          checkIn: '2026-09-10T00:00:00.000Z',
          checkOut: '2026-09-12T00:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prismaMock.booking.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('quote', () => {
    const dto = {
      stayId: '11111111-1111-4111-8111-111111111111',
      checkIn: '2026-09-20T00:00:00.000Z',
      checkOut: '2026-09-23T00:00:00.000Z',
      guests: 2,
    };

    beforeEach(() => {
      prismaMock.stay.findUnique.mockResolvedValue({
        id: dto.stayId,
        pricePerNight: 4500,
        maxGuests: 4,
      });

      prismaMock.booking.findFirst.mockResolvedValue(null);
    });

    it('should return a booking quote', async () => {
      await expect(service.quote(dto)).resolves.toEqual({
        stayId: dto.stayId,
        checkIn: new Date(dto.checkIn),
        checkOut: new Date(dto.checkOut),
        guests: dto.guests,
        nights: 3,
        pricePerNight: 4500,
        totalAmount: 13500,
      });
    });

    it('should reject when quoted dates are unavailable', async () => {
      prismaMock.booking.findFirst.mockResolvedValue({
        id: 'existing-booking',
      });

      await expect(service.quote(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    const dto = {
      userId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      stayId: '11111111-1111-4111-8111-111111111111',
      checkIn: '2026-09-10T00:00:00.000Z',
      checkOut: '2026-09-13T00:00:00.000Z',
      guests: 2,
    };

    beforeEach(() => {
      txMock.user.findUnique.mockResolvedValue({
        id: dto.userId,
      });

      txMock.stay.findUnique.mockResolvedValue({
        id: dto.stayId,
        pricePerNight: 4500,
        maxGuests: 4,
      });

      txMock.booking.findFirst.mockResolvedValue(null);

      txMock.booking.create.mockResolvedValue({
        id: 'booking-1',
        userId: dto.userId,
        stayId: dto.stayId,
        checkIn: new Date(dto.checkIn),
        checkOut: new Date(dto.checkOut),
        guests: dto.guests,
        totalAmount: 13500,
        status: 'PENDING',
      });
    });

    it('should create a pending booking with the correct total', async () => {
      const result = await service.create(dto);

      expect(result).toEqual({
        id: 'booking-1',
        userId: dto.userId,
        stayId: dto.stayId,
        checkIn: new Date(dto.checkIn),
        checkOut: new Date(dto.checkOut),
        guests: dto.guests,
        totalAmount: 13500,
        status: 'PENDING',
      });

      expect(txMock.booking.create).toHaveBeenCalledWith({
        data: {
          userId: dto.userId,
          stayId: dto.stayId,
          checkIn: new Date(dto.checkIn),
          checkOut: new Date(dto.checkOut),
          guests: 2,
          totalAmount: 13500,
          status: 'PENDING',
        },
      });
    });

    it('should calculate one night correctly', async () => {
      const oneNightDto = {
        ...dto,
        checkIn: '2026-09-10T00:00:00.000Z',
        checkOut: '2026-09-11T00:00:00.000Z',
      };

      await service.create(oneNightDto);

      expect(txMock.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalAmount: 4500,
          }),
        }),
      );
    });

    it('should reject an invalid date range', async () => {
      await expect(
        service.create({
          ...dto,
          checkIn: '2026-09-15T00:00:00.000Z',
          checkOut: '2026-09-10T00:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prismaMock.$transaction).not.toHaveBeenCalled();
      expect(txMock.user.findUnique).not.toHaveBeenCalled();
      expect(txMock.stay.findUnique).not.toHaveBeenCalled();
      expect(txMock.booking.create).not.toHaveBeenCalled();
    });

    it('should reject when the user does not exist', async () => {
      txMock.user.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(txMock.booking.create).not.toHaveBeenCalled();
    });

    it('should reject when the stay does not exist', async () => {
      txMock.stay.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(txMock.booking.create).not.toHaveBeenCalled();
    });

    it('should reject when guest count exceeds stay capacity', async () => {
      txMock.stay.findUnique.mockResolvedValue({
        id: dto.stayId,
        pricePerNight: 4500,
        maxGuests: 2,
      });

      await expect(
        service.create({
          ...dto,
          guests: 3,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(txMock.booking.findFirst).not.toHaveBeenCalled();
      expect(txMock.booking.create).not.toHaveBeenCalled();
    });

    it('should reject when the requested dates are already booked', async () => {
      txMock.booking.findFirst.mockResolvedValue({
        id: 'existing-booking',
      });

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(txMock.booking.create).not.toHaveBeenCalled();
    });
  });
});
