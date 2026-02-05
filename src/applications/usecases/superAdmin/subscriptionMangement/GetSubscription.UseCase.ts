import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";

export class GetActivePlansUseCase {
  constructor(private readonly _planRepo: ISubscriptionPlanRepository) {}

  async execute() {
    return this._planRepo.findActivePlans();
  }
}
