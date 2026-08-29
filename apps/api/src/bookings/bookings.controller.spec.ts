import { jest } from '@jest/globals';
import { BookingsController } from './bookings.controller';

describe('BookingsController', () => {
  let controller: BookingsController;

  const bookingsServiceMock = {
    checkAvailability: jest.fn<() => Promise<unknown>>(),
    quote: jest.fn<() => Promise<unknown>>(),
    create: jest.fn<() => Promise<unknown>>(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new BookingsController(
      bookingsServiceMock as any,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate availability checks to the service', async () => {
    const stayId = '11111111-1111-4111-8111-111111111111';

    const query = {
      checkIn: '2026-09-10T00:00:00.000Z',
      checkOut: '2026-09-12T00:00:00.000Z',
    };

    const response = {
      available: true,
    };

    bookingsServiceMock.checkAvailability.mockResolvedValue(response);

    await expect(
      controller.checkAvailability(stayId, query),
    ).resolves.toEqual(response);

    expect(
      bookingsServiceMock.checkAvailability,
    ).toHaveBeenCalledWith(stayId, query);
  });

  it('should delegate booking creation to the service', async () => {
    const dto = {
      userId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      stayId: '11111111-1111-4111-8111-111111111111',
      checkIn: '2026-09-10T00:00:00.000Z',
      checkOut: '2026-09-12T00:00:00.000Z',
      guests: 2,
    };

    const response = {
      id: 'booking-1',
      ...dto,
      totalAmount: 9000,
      status: 'PENDING',
    };

    bookingsServiceMock.create.mockResolvedValue(response);

    await expect(
      controller.create(dto),
    ).resolves.toEqual(response);

    expect(bookingsServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should delegate booking quotes to the service', async () => {
    const dto = {
      stayId: '11111111-1111-4111-8111-111111111111',
      checkIn: '2026-09-20T00:00:00.000Z',
      checkOut: '2026-09-23T00:00:00.000Z',
      guests: 2,
    };

    const response = {
      ...dto,
      nights: 3,
      pricePerNight: 4500,
      totalAmount: 13500,
    };

    bookingsServiceMock.quote.mockResolvedValue(response);

    await expect(controller.quote(dto)).resolves.toEqual(response);

    expect(bookingsServiceMock.quote).toHaveBeenCalledWith(dto);
  });
});
