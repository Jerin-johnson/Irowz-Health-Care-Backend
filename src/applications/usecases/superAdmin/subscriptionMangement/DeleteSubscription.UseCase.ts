import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { IDeleteSubscriptionUseCase } from "../../../../domain/usecase/superAdmin/subcriptionMangment/IDeleteSubscriptionUseCase";

export class DeleteSubscriptionUseCase implements IDeleteSubscriptionUseCase {
  constructor(private readonly _planRepo: ISubscriptionPlanRepository) {}

  async execute(id: string) {
    await this._planRepo.update(id, { isDeleted: true });
  }
}
