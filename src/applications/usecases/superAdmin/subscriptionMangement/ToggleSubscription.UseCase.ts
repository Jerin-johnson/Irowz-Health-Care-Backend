import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { IToggleSubscription } from "../../../../domain/usecase/superAdmin/subcriptionMangment/IToggleSubscription";

export class ToggleSubscription implements IToggleSubscription {
  constructor(private readonly _planRepo: ISubscriptionPlanRepository) {}

  async execute(planId: string, isActive: boolean) {
    await this._planRepo.update(planId, { isActive });
  }
}
