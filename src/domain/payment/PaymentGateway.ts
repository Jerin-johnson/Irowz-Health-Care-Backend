export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
}

export interface IPaymentGateway {
  createOrder(params: { amount: number; receipt: string }): Promise<PaymentOrder>;

  verifyPaymentSignature(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): boolean;
}
