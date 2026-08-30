import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, PaymentStatus } from '../generated/prisma/client';

export const RAZORPAY = 'RAZORPAY';

type RazorpayClient = {
  orders: {
    create: (options: {
      amount: number;
      currency: string;
      receipt: string;
    }) => Promise<{ id: string }>;
  };
};

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(RAZORPAY)
    private readonly razorpay: RazorpayClient,
  ) {}

  async createOrder(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      select: {
        id: true,
        userId: true,
        totalAmount: true,
        status: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Only pending bookings can be paid for',
      );
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        bookingId: booking.id,
        status: {
          in: [PaymentStatus.CREATED, PaymentStatus.PENDING],
        },
      },
      select: {
        id: true,
        razorpayOrderId: true,
        amount: true,
        status: true,
      },
    });

    if (existingPayment) {
      return {
        paymentId: existingPayment.id,
        razorpayOrderId: existingPayment.razorpayOrderId,
        amount: existingPayment.amount,
        status: existingPayment.status,
      };
    }

    const order = await this.razorpay.orders.create({
      amount: booking.totalAmount * 100,
      currency: 'INR',
      receipt: booking.id,
    });

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: order.id,
        amount: booking.totalAmount,
        status: PaymentStatus.CREATED,
      },
    });

    return {
      paymentId: payment.id,
      razorpayOrderId: payment.razorpayOrderId,
      amount: payment.amount,
      currency: 'INR',
      status: payment.status,
    };
  }

  async verifyPayment(
    userId: string,
    paymentId: string,
    bookingId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        bookingId,
        booking: {
          userId,
        },
      },
      include: {
        booking: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.razorpayOrderId !== razorpayOrderId) {
      throw new BadRequestException('Invalid Razorpay order');
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      return {
        paymentId: payment.id,
        bookingId: payment.bookingId,
        status: payment.status,
        bookingStatus: payment.booking.status,
      };
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new BadRequestException(
        'Razorpay configuration is missing',
      );
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpaySignature);

    const signatureValid =
      expectedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signatureValid) {
      throw new BadRequestException(
        'Invalid Razorpay payment signature',
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          razorpayPaymentId,
          status: PaymentStatus.SUCCESS,
        },
        select: {
          id: true,
          bookingId: true,
          razorpayPaymentId: true,
          status: true,
        },
      });

      const updatedBooking = await tx.booking.update({
        where: {
          id: payment.bookingId,
        },
        data: {
          status: BookingStatus.CONFIRMED,
        },
        select: {
          id: true,
          status: true,
        },
      });

      return {
        payment: updatedPayment,
        booking: updatedBooking,
      };
    });

    return {
      paymentId: result.payment.id,
      bookingId: result.booking.id,
      razorpayPaymentId: result.payment.razorpayPaymentId,
      status: result.payment.status,
      bookingStatus: result.booking.status,
    };
  }
}
