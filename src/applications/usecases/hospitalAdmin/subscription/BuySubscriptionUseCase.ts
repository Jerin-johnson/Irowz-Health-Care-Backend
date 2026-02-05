import { Types } from "mongoose";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { IHospitalSubscriptionRepository } from "../../../../domain/repositories/IHospitalSubscriptionRepository";
import { WalletRepository } from "../../../../infrastructure/repositories/WalletRepository";

export class BuySubscriptionUseCase {
  constructor(
    private readonly planRepo: ISubscriptionPlanRepository,
    private readonly hospitalSubRepo: IHospitalSubscriptionRepository,
    private readonly walletRepo: WalletRepository
  ) {}

  async execute(hospitalId: string, planId: string, superAdminId: string) {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    const active = await this.hospitalSubRepo.findActiveByHospital(hospitalId);

    if (active) throw new Error("Active subscription already exists");

    const plan = await this.planRepo.findById(planId);
    if (!plan || !plan.isActive || plan.isDeleted) throw new Error("Plan not available");

    await this.walletRepo.debit(
      new Types.ObjectId(hospitalId),
      plan.price,
      "SUBSCRIPTION_PURCHASE",
      plan._id
      // session
    );

    // 4. create subscription snapshot
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const subscription = await this.hospitalSubRepo.create(
      {
        hospitalId: new Types.ObjectId(hospitalId),
        planId: plan._id,
        doctorLimitSnapshot: plan.doctorLimit,
        priceSnapshot: plan.price,
        durationSnapshot: plan.durationInDays,
        startDate,
        endDate,
        status: "ACTIVE",
      }
      //   session
    );

    if (!subscription) throw new Error("subscription is created");

    // 5. credit superadmin wallet
    await this.walletRepo.credit(
      new Types.ObjectId(superAdminId),
      plan.price,
      "SUBSCRIPTION_SALE",
      subscription._id
      //   session
    );

    // await session.commitTransaction();
    // session.endSession();

    return subscription;
  }
}
