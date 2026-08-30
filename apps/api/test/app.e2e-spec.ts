import 'dotenv/config';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { createHmac } from 'crypto';

import { AppModule } from './../src/app.module';
import { RAZORPAY } from './../src/payments/payments.service';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Stays Booking Platform (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  let accessToken: string;
  let userId: string;
  let bookingId: string;
  let paymentId: string;
  let razorpayOrderId: string;

  const stayId = '44444444-4444-4444-8444-444444444444';

  /*
   * Use a date based on the current timestamp so every E2E run
   * gets a different booking window.
   *
   * The date is several years in the future so it won't interfere
   * with normal development bookings.
   */
  const testStart = new Date();

  testStart.setUTCFullYear(testStart.getUTCFullYear() + 5);
  testStart.setUTCMonth(0, 1);
  testStart.setUTCDate(1 + (Date.now() % 300));
  testStart.setUTCHours(0, 0, 0, 0);

  const checkIn = testStart.toISOString();

  const testEnd = new Date(testStart);
  testEnd.setUTCDate(testEnd.getUTCDate() + 2);

  const checkOut = testEnd.toISOString();

  const guests = 2;

  const email = `e2e-${Date.now()}@stays.local`;
  const password = 'Password123!';
  const name = 'E2E Test User';

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(RAZORPAY)
        .useValue({
          orders: {
            create: async () => ({
              id: `order_e2e_${Date.now()}`,
            }),
          },
        })
        .compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    /*
     * Remove only records created by this E2E test.
     *
     * Payment references booking, so remove payments first.
     */
    if (paymentId) {
      await prisma.payment.deleteMany({
        where: {
          id: paymentId,
        },
      });
    }

    if (bookingId) {
      await prisma.booking.deleteMany({
        where: {
          id: bookingId,
        },
      });
    }

    if (userId) {
      await prisma.user.deleteMany({
        where: {
          id: userId,
        },
      });
    }

    if (app) {
      await app.close();
    }
  });

  it('GET / returns the API response', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /auth/register creates a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name,
        email,
        password,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');

    expect(response.body.email).toBe(email);
    expect(response.body.name).toBe(name);

    userId = response.body.id;

    expect(userId).toBeTruthy();
  });

  it('POST /auth/login authenticates the user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('user');

    expect(response.body.user.id).toBe(userId);
    expect(response.body.user.email).toBe(email);

    accessToken = response.body.accessToken;

    expect(accessToken).toBeTruthy();
  });

  it('GET /auth/me returns the authenticated user', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.id).toBe(userId);
    expect(response.body.email).toBe(email);
    expect(response.body.name).toBe(name);
  });

  it('GET /stays returns the stay catalogue', async () => {
    const response = await request(app.getHttpServer())
      .get('/stays')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data)).toBe(true);

    const stay = response.body.data.find(
      (item: { id: string }) => item.id === stayId,
    );

    expect(stay).toBeDefined();
  });

  it('GET /stays/:id returns the selected stay', async () => {
    const response = await request(app.getHttpServer())
      .get(`/stays/${stayId}`)
      .expect(200);

    expect(response.body.id).toBe(stayId);
    expect(response.body.name).toBe('City Heritage Stay');
    expect(response.body.city).toBe('Jaipur');
    expect(response.body.state).toBe('Rajasthan');
    expect(Number(response.body.pricePerNight)).toBe(3500);
    expect(Number(response.body.maxGuests)).toBe(3);
  });

  it('GET /bookings/stays/:stayId/availability checks availability', async () => {
    const response = await request(app.getHttpServer())
      .get(`/bookings/stays/${stayId}/availability`)
      .query({
        checkIn,
        checkOut,
      })
      .expect(200);

    expect(response.body).toHaveProperty('available');
    expect(typeof response.body.available).toBe('boolean');

    expect(response.body.available).toBe(true);
  });

  it('POST /bookings/quote calculates the booking price', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings/quote')
      .send({
        stayId,
        checkIn,
        checkOut,
        guests,
      })
      .expect(201);

    expect(response.body.stayId).toBe(stayId);
    expect(response.body.guests).toBe(guests);
    expect(response.body.nights).toBe(2);
    expect(Number(response.body.pricePerNight)).toBe(3500);
    expect(Number(response.body.totalAmount)).toBe(7000);
  });

  it('POST /bookings creates a pending booking', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        stayId,
        checkIn,
        checkOut,
        guests,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(userId);
    expect(response.body.stayId).toBe(stayId);
    expect(response.body.guests).toBe(guests);
    expect(Number(response.body.totalAmount)).toBe(7000);
    expect(response.body.status).toBe('PENDING');

    bookingId = response.body.id;

    expect(bookingId).toBeTruthy();
  });

  it('POST /payments/order creates a Razorpay payment order', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bookingId,
      })
      .expect(201);

    expect(response.body).toHaveProperty('paymentId');
    expect(response.body).toHaveProperty('razorpayOrderId');

    expect(response.body.amount).toBe(7000);
    expect(response.body.currency).toBe('INR');
    expect(response.body.status).toBe('CREATED');

    paymentId = response.body.paymentId;
    razorpayOrderId = response.body.razorpayOrderId;

    expect(paymentId).toBeTruthy();
    expect(razorpayOrderId).toBeTruthy();
  });

  it('POST /payments/verify verifies the payment and confirms the booking', async () => {
    const razorpayPaymentId = `pay_e2e_${Date.now()}`;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error(
        'RAZORPAY_KEY_SECRET is required for the E2E payment test',
      );
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;

    const razorpaySignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const response = await request(app.getHttpServer())
      .post('/payments/verify')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        paymentId,
        bookingId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      })
      .expect(201);

    expect(response.body.paymentId).toBe(paymentId);
    expect(response.body.bookingId).toBe(bookingId);
    expect(response.body.razorpayPaymentId).toBe(razorpayPaymentId);
    expect(response.body.status).toBe('SUCCESS');
    expect(response.body.bookingStatus).toBe('CONFIRMED');
  });
});