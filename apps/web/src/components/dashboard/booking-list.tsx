import type { Booking } from "@/lib/types";
import { BookingCard } from "@/components/dashboard/booking-card";
import { EmptyState } from "@/components/common/feedback";
import { routes } from "@/lib/routes";

export function BookingList({ bookings }: Readonly<{ bookings: Booking[] }>) {
  if (!bookings.length) {
    return (
      <EmptyState
        title="No bookings yet"
        description="Your confirmed and pending bookings will appear here once the backend returns booking records."
        actionLabel="Explore stays"
        actionHref={routes.stays}
      />
    );
  }

  return (
    <div className="stays-grid">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
