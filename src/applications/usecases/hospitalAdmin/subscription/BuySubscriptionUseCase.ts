import { Types } from "mongoose";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { HospitalSubscriptionRepository } from "../../../../infrastructure/repositories/HospitalSubscriptionRepository";
import { WalletRepository } from "../../../../infrastructure/repositories/WalletRepository";
import { IExternalGateway } from "../../../../domain/payment/PaymentGateway";
import { IBuySubscriptionUseCase } from "../../../../domain/usecase/hosptialAdmin/subscription/IBuySubscriptionUseCase";

export class BuySubscriptionUseCase implements IBuySubscriptionUseCase {
  constructor(
    private _paymentGateway: IExternalGateway,
    private _planRepo: ISubscriptionPlanRepository,
    private _hospitalSubRepo: HospitalSubscriptionRepository,
    private _walletRepo: WalletRepository
  ) {}

  async execute(payload: {
    hospitalId: string;
    planId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    superAdminId: string;
  }) {
    const isValid = this._paymentGateway.verifySignature({
      orderId: payload.razorpayOrderId,
      paymentId: payload.razorpayPaymentId,
      signature: payload.razorpaySignature,
    });

    if (!isValid) throw new Error("Payment verification failed");

    const active = await this._hospitalSubRepo.findActiveByHospital(payload.hospitalId);

    if (active) {
      active.status = "CANCELLED";
      await this._hospitalSubRepo.save(active);
    }

    const plan = await this._planRepo.findById(payload.planId);
    if (!plan || !plan.isActive || plan.isDeleted) throw new Error("Plan not available");

    // await this._walletRepo.debit(
    //   new Types.ObjectId(payload.hospitalId),
    //   plan.price,
    //   "SUBSCRIPTION_PURCHASE",
    //   plan._id
    // );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const subscription = await this._hospitalSubRepo.create({
      hospitalId: payload.hospitalId,
      planId: plan._id,

      doctorLimitSnapshot: plan.doctorLimit,
      priceSnapshot: plan.price,
      durationSnapshot: plan.durationInDays,

      startDate,
      endDate,
      status: "ACTIVE",
    });

    if (!subscription) throw new Error("something went wrong");

    await this._walletRepo.credit(
      new Types.ObjectId(payload.superAdminId),
      plan.price,
      "SUBSCRIPTION_SALE",
      subscription._id
    );

    return subscription;
  }
}
