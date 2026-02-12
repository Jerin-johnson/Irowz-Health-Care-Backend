export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
}

export type PaymentInitResult =
  | {
      method: "RAZORPAY";
      orderId: string;
      amount: number;
      currency: string;
    }
  | {
      method: "WALLET";
      status: "PAID";
    };

export interface IPaymentProvider {
  initiate(input: {
    appointmentId: string;
    amount: number;
    patientId: string;
  }): Promise<PaymentInitResult>;
}

// export interface IExternalPaymentVerifier {
//   verify(params: { orderId: string; paymentId: string; signature: string }): boolean;
// }

export interface IExternalGateway {
  createOrder(input: { amount: number; receipt: string }): Promise<{
    id: string;
    amount: number;
    currency: string;
  }>;

  verifySignature(input: { orderId: string; paymentId: string; signature: string }): boolean;
}

export interface IPaymentGateway {
  createOrder(params: { amount: number; receipt: string }): Promise<PaymentOrder>;

  verifyPaymentSignature(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): boolean;
}
