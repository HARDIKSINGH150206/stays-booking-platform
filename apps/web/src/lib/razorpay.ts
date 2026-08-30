const RAZORPAY_SCRIPT_ID = "stays-razorpay-script";

export function getRazorpayKeyId(): string | null {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
    process.env.NEXT_PUBLIC_RAZORPAY_KEY ??
    null
  );
}

export function hasRazorpayKey(): boolean {
  return Boolean(getRazorpayKeyId());
}

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  const existing = document.getElementById(RAZORPAY_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay.")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay."));
    document.body.appendChild(script);
  });
}
