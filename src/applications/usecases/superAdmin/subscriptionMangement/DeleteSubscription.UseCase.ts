import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";

export class DeleteSubscriptionUseCase {
  constructor(private readonly _planRepo: ISubscriptionPlanRepository) {}

  async execute(id: string) {
    await this._planRepo.update(id, { isDeleted: true });
  }
}
