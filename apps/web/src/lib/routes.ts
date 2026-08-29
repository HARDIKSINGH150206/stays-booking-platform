export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  stays: "/stays",
  bookings: "/bookings",
  booking: (stayId: string) => `/booking/${stayId}`,
  stay: (stayId: string) => `/stays/${stayId}`,
  payment: (bookingId: string) => `/payment/${bookingId}`,
  confirmation: (bookingId: string) => `/confirmation/${bookingId}`,
};
