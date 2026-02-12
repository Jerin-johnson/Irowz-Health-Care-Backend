import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { IGetActivePlansUseCase } from "../../../../domain/usecase/superAdmin/subcriptionMangment/IGetActivePlansUseCase";

export class GetActivePlansUseCase implements IGetActivePlansUseCase {
  constructor(private readonly _planRepo: ISubscriptionPlanRepository) {}

  async execute() {
    return this._planRepo.findActivePlans();
  }
}
