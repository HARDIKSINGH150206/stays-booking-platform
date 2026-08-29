import { requestJson } from "@/lib/api/client";
import { normalizeSingleOrder, normalizeSinglePayment } from "@/lib/api/normalize";
import type { Payment, RazorpayOrder, RazorpayVerificationInput } from "@/lib/types";

export async function createPaymentOrder(bookingId: string): Promise<RazorpayOrder> {
  const payload = await requestJson<unknown>("/payments/order", {
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });

  const order = normalizeSingleOrder(payload);
  if (!order) {
    throw new Error("Payment order response was incomplete.");
  }

  return order;
}

export async function verifyPayment(
  input: RazorpayVerificationInput,
): Promise<Payment> {
  const payload = await requestJson<unknown>("/payments/verify", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const payment = normalizeSinglePayment(payload);
  if (!payment) {
    throw new Error("Payment verification response was incomplete.");
  }

  return payment;
}
