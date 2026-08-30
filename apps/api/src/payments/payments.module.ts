import { Module } from '@nestjs/common';
import Razorpay from 'razorpay';
import { PaymentsController } from './payments.controller';
import { PaymentsService, RAZORPAY } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: RAZORPAY,
      useFactory: () =>
        new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID ?? '',
          key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
        }),
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
