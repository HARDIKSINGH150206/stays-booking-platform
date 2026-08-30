import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  const paymentsServiceMock = {
    createOrder: jest.fn<
      (
        userId: string,
        bookingId: string,
      ) => Promise<{
        paymentId: string;
        razorpayOrderId: string;
        amount: number;
        currency: string;
        status: string;
      }>
    >(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [PaymentsController],
        providers: [
          {
            provide: PaymentsService,
            useValue: paymentsServiceMock,
          },
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue({
          canActivate: jest.fn(() => true),
        })
        .compile();

    controller = module.get<PaymentsController>(
      PaymentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a payment order for the authenticated user', async () => {
    const user = {
      sub: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      email: 'user@example.com',
    };

    const dto = {
      bookingId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    };

    const response = {
      paymentId: 'payment-123',
      razorpayOrderId: 'order_123',
      amount: 9000,
      currency: 'INR',
      status: 'CREATED',
    };

    paymentsServiceMock.createOrder.mockResolvedValue(response);

    await expect(
      controller.createOrder(user, dto),
    ).resolves.toEqual(response);

    expect(
      paymentsServiceMock.createOrder,
    ).toHaveBeenCalledWith(
      user.sub,
      dto.bookingId,
    );
  });
});
