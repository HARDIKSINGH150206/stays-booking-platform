import type { Stay } from "@/lib/types";
import { StayCard } from "@/components/stays/stay-card";

export function StayList({ stays }: Readonly<{ stays: Stay[] }>) {
  return (
    <div className="stays-grid stays-grid-3">
      {stays.map((stay) => (
        <StayCard key={stay.id} stay={stay} />
      ))}
    </div>
  );
}
