export {};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency?: string;
    name: string;
    description?: string;
    order_id: string;
    prefill?: {
      name?: string;
      email?: string;
    };
    handler: (response: RazorpaySuccessResponse) => void;
    modal?: {
      ondismiss?: () => void;
    };
    theme?: {
      color?: string;
    };
  }

  interface RazorpayInstance {
    open: () => void;
    close: () => void;
  }

  interface RazorpaySuccessResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
}
