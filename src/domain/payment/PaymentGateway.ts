export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
}

export interface IPaymentGateway {
  createOrder(params: { amount: number; receipt: string }): Promise<PaymentOrder>;

  verifyWebhookSignature(payload: string, signature: string): boolean;
}
