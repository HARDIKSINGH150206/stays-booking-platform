"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { InlineNotice } from "@/components/common/feedback";
import { createPaymentOrder, verifyPayment } from "@/lib/api/payments";
import { isApiUnavailableError, toErrorMessage } from "@/lib/api/client";
import { getRazorpayKeyId, loadRazorpayScript } from "@/lib/razorpay";
import type { Booking } from "@/lib/types";
import { useSession } from "@/components/providers/session-provider";

interface RazorpayCheckoutProps {
  booking: Booking;
  onConfirmed: (bookingId: string) => void;
}

export function RazorpayCheckout({ booking, onConfirmed }: Readonly<RazorpayCheckoutProps>) {
  const { session } = useSession();
  const [status, setStatus] = useState<
    "idle" | "loading" | "opening" | "verifying" | "success" | "failed" | "cancelled"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handlePay() {
    setErrorMessage(null);
    setStatus("loading");

    try {
      const order = await createPaymentOrder(booking.id);
      const checkoutKey = order.keyId ?? getRazorpayKeyId();

      if (!checkoutKey) {
        throw new Error(
          "Razorpay public key is missing. Add NEXT_PUBLIC_RAZORPAY_KEY_ID or return a public key with the order response.",
        );
      }

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout is unavailable in this browser session.");
      }

      setStatus("opening");
      const checkout = new window.Razorpay({
        key: checkoutKey,
        amount: order.amount,
        currency: order.currency ?? "INR",
        name: "STAYS",
        description: booking.stay?.name ?? "Stay booking",
        order_id: order.orderId,
        prefill: {
          name: session?.user.name,
          email: session?.user.email,
        },
        theme: {
          color: "#7a5d3e",
        },
        modal: {
          ondismiss: () => {
            setStatus("cancelled");
            setErrorMessage("Payment window closed before completion.");
          },
        },
        handler: async (response) => {
          setStatus("verifying");
          try {
            await verifyPayment({
              bookingId: booking.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setStatus("success");
            onConfirmed(booking.id);
          } catch (error) {
            setStatus("failed");
            if (isApiUnavailableError(error)) {
              setErrorMessage(
                "Payment verification is not connected yet. Checkout completed, but the backend cannot confirm it.",
              );
            } else {
              setErrorMessage(toErrorMessage(error));
            }
          }
        },
      });

      checkout.open();
    } catch (error) {
      setStatus("failed");
      if (isApiUnavailableError(error)) {
        setErrorMessage(
          "Payment backend is not connected yet. Razorpay checkout cannot be completed until the order and verification endpoints are live.",
        );
      } else {
        setErrorMessage(toErrorMessage(error));
      }
    }
  }

  return (
    <div className="grid gap-4">
      {errorMessage ? <InlineNotice tone="danger">{errorMessage}</InlineNotice> : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={handlePay}
          disabled={status === "loading" || status === "opening" || status === "verifying"}
        >
          {status === "loading"
            ? "Preparing checkout..."
            : status === "opening"
              ? "Opening checkout..."
              : status === "verifying"
                ? "Verifying payment..."
                : "Pay with Razorpay"}
        </Button>
        <p className="text-sm text-[var(--text-muted)]">
          Payment only confirms after backend verification.
        </p>
      </div>
      {status === "success" ? (
        <InlineNotice tone="success">Payment verified successfully.</InlineNotice>
      ) : null}
      {status === "cancelled" ? (
        <InlineNotice tone="warning">Payment was cancelled.</InlineNotice>
      ) : null}
    </div>
  );
}
