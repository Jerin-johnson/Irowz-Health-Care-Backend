import { IHospitalSubscriptionRepository } from "../../../../domain/repositories/IHospitalSubscriptionRepository";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { IGetActivePlansForListingHospitalAdminUseCase } from "../../../../domain/usecase/hosptialAdmin/subscription/IGetActivePlansForListingHospitalAdminUseCase";

export class GetActivePlansForListingHospitalAdminUseCase implements IGetActivePlansForListingHospitalAdminUseCase {
  constructor(
    private readonly _planRepo: ISubscriptionPlanRepository,
    private readonly _hospitalSubRepo: IHospitalSubscriptionRepository
  ) {}

  async execute(hospitalId: string) {
    const plans = await this._planRepo.findPlanForListing();
    const activeSub = await this._hospitalSubRepo.findActiveByHospital(hospitalId);

    console.log("the hospitalid and result", hospitalId, activeSub);

    return {
      plans,
      activePlanId: activeSub?.planId,
    };
  }
}
