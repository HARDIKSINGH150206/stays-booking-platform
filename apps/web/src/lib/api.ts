import type {
  AuthResponse,
  AvailabilityResponse,
  Booking,
  BookingQuote,
  PaymentOrder,
  PaymentVerificationResponse,
  StayListResponse,
  Stay,
  User,
} from './types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type ApiOptions = RequestInit & {
  token?: string;
};

async function request<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  const contentType = response.headers.get('content-type');
  const body = contentType?.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      body?.message ??
      body?.error ??
      'Something went wrong. Please try again.';

    throw new Error(
      Array.isArray(message) ? message.join(', ') : message,
    );
  }

  return body as T;
}

export async function register(
  name: string,
  email: string,
  password: string,
) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export async function login(
  email: string,
  password: string,
) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function getCurrentUser(token: string) {
  return request<User>('/auth/me', {
    token,
  });
}

export async function getStays(params: {
  city?: string;
  state?: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params.city) searchParams.set('city', params.city);
  if (params.state) searchParams.set('state', params.state);
  if (params.guests) {
    searchParams.set('guests', String(params.guests));
  }
  if (params.checkIn) {
    searchParams.set('checkIn', params.checkIn);
  }
  if (params.checkOut) {
    searchParams.set('checkOut', params.checkOut);
  }

  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('limit', String(params.limit ?? 20));

  return request<StayListResponse>(
    `/stays?${searchParams.toString()}`,
  );
}

export async function getStay(id: string) {
  return request<Stay>(`/stays/${id}`);
}

export async function checkAvailability(
  stayId: string,
  checkIn: string,
  checkOut: string,
) {
  const params = new URLSearchParams({
    checkIn,
    checkOut,
  });

  return request<AvailabilityResponse>(
    `/bookings/stays/${stayId}/availability?${params.toString()}`,
  );
}

export async function getBookingQuote(input: {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  return request<BookingQuote>('/bookings/quote', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function createBooking(
  token: string,
  input: {
    stayId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  },
) {
  return request<Booking>('/bookings', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}

export async function getMyBookings(token: string) {
  return request<Booking[]>('/bookings/me', {
    token,
  });
}

export async function createPaymentOrder(
  token: string,
  bookingId: string,
) {
  return request<PaymentOrder>('/payments/order', {
    method: 'POST',
    token,
    body: JSON.stringify({
      bookingId,
    }),
  });
}

export async function verifyPayment(
  token: string,
  input: {
    paymentId: string;
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
) {
  return request<PaymentVerificationResponse>(
    '/payments/verify',
    {
      method: 'POST',
      token,
      body: JSON.stringify(input),
    },
  );
}
