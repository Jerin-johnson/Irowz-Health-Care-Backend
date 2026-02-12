export interface CreateSubscriptionOrderResult {
  orderId: string;
  amount: number;
  currency: string;
}

export interface ICreateSubscriptionOrderUseCase {
  execute(planId: string): Promise<CreateSubscriptionOrderResult>;
}
