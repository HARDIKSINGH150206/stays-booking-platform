import { Badge } from "@/components/common/badge";
import type { PaymentStatus } from "@/lib/types";
import { getPaymentStatusTone } from "@/lib/utils";

export function PaymentStatusPill({ status }: Readonly<{ status: PaymentStatus }>) {
  return <Badge tone={getPaymentStatusTone(status)}>{status}</Badge>;
}
