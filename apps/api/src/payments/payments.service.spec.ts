import { jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingStatus, PaymentStatus } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService, RAZORPAY } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const razorpayCreateOrderMock = jest.fn<
    (options: {
      amount: number;
      currency: string;
      receipt: string;
    }) => Promise<{ id: string }>
  >();

  const prismaMock = {
    booking: {
      findFirst: jest.fn<
        () => Promise<{
          id: string;
          userId: string;
          totalAmount: number;
          status: BookingStatus;
        } | null>
      >(),
    },
    payment: {
      findFirst: jest.fn<
        () => Promise<{
          id: string;
          razorpayOrderId: string;
          amount: number;
          status: PaymentStatus;
        } | null>
      >(),
      create: jest.fn<
        () => Promise<{
          id: string;
          razorpayOrderId: string;
          amount: number;
          status: PaymentStatus;
        }>
      >(),
    },
  };

  const razorpayMock = {
    orders: {
      create: razorpayCreateOrderMock,
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          PaymentsService,
          {
            provide: PrismaService,
            useValue: prismaMock,
          },
          {
            provide: RAZORPAY,
            useValue: razorpayMock,
          },
        ],
      }).compile();

    service = module.get(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject a booking that does not belong to the user', async () => {
    prismaMock.booking.findFirst.mockResolvedValue(null);

    await expect(
      service.createOrder(
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prismaMock.payment.findFirst).not.toHaveBeenCalled();
    expect(razorpayCreateOrderMock).not.toHaveBeenCalled();
  });

  it('should reject a non-pending booking', async () => {
    prismaMock.booking.findFirst.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      totalAmount: 9000,
      status: BookingStatus.CONFIRMED,
    });

    await expect(
      service.createOrder('user-1', 'booking-1'),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prismaMock.payment.findFirst).not.toHaveBeenCalled();
    expect(razorpayCreateOrderMock).not.toHaveBeenCalled();
  });

  it('should return an existing active payment instead of creating another order', async () => {
    prismaMock.booking.findFirst.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      totalAmount: 9000,
      status: BookingStatus.PENDING,
    });

    prismaMock.payment.findFirst.mockResolvedValue({
      id: 'payment-1',
      razorpayOrderId: 'order_existing',
      amount: 9000,
      status: PaymentStatus.CREATED,
    });

    const result = await service.createOrder(
      'user-1',
      'booking-1',
    );

    expect(result).toEqual({
      paymentId: 'payment-1',
      razorpayOrderId: 'order_existing',
      amount: 9000,
      status: PaymentStatus.CREATED,
    });

    expect(prismaMock.payment.create).not.toHaveBeenCalled();
    expect(razorpayCreateOrderMock).not.toHaveBeenCalled();
  });

  it('should create a Razorpay order and payment record', async () => {
    prismaMock.booking.findFirst.mockResolvedValue({
      id: 'booking-1',
      userId: 'user-1',
      totalAmount: 9000,
      status: BookingStatus.PENDING,
    });

    prismaMock.payment.findFirst.mockResolvedValue(null);

    razorpayCreateOrderMock.mockResolvedValue({
      id: 'order_123',
    });

    prismaMock.payment.create.mockResolvedValue({
      id: 'payment-123',
      razorpayOrderId: 'order_123',
      amount: 9000,
      status: PaymentStatus.CREATED,
    });

    const result = await service.createOrder(
      'user-1',
      'booking-1',
    );

    expect(razorpayCreateOrderMock).toHaveBeenCalledWith({
      amount: 900000,
      currency: 'INR',
      receipt: 'booking-1',
    });

    expect(prismaMock.payment.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'booking-1',
        razorpayOrderId: 'order_123',
        amount: 9000,
        status: PaymentStatus.CREATED,
      },
    });

    expect(result).toEqual({
      paymentId: 'payment-123',
      razorpayOrderId: 'order_123',
      amount: 9000,
      currency: 'INR',
      status: PaymentStatus.CREATED,
    });
  });
});
