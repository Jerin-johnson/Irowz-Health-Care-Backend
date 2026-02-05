import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";

export class ToggleSubscription {
  constructor(private readonly _planRepo: ISubscriptionPlanRepository) {}

  async execute(planId: string, isActive: boolean) {
    await this._planRepo.update(planId, { isActive });
  }
}
