import { IExternalGateway } from "../../../../domain/payment/PaymentGateway";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { ICreateSubscriptionOrderUseCase } from "../../../../domain/usecase/hosptialAdmin/subscription/ICreateSubscriptionOrderUseCase";

export class CreateSubscriptionOrderUseCase implements ICreateSubscriptionOrderUseCase {
  constructor(
    private _paymentGateway: IExternalGateway,
    private _planRepo: ISubscriptionPlanRepository
  ) {}

  async execute(planId: string) {
    const plan = await this._planRepo.findById(planId);

    console.log(plan);

    if (!plan || !plan.isActive || plan.isDeleted) throw new Error("Plan not available");

    console.log(plan.price, planId, plan._id);

    const order = await this._paymentGateway.createOrder({
      amount: plan.price * 100, // Razorpay needs paise
      receipt: `plan_${String(plan._id).slice(-7)}_${Date.now()}`,
    });

    console.log("the orrder is ", order);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  }
}
