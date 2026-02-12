import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { ICreateSubscriptionPlanUseCase } from "../../../../domain/usecase/superAdmin/subcriptionMangment/ICreateSubscriptionPlanUseCase";

export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(private readonly _planRepo: ISubscriptionPlanRepository) {}

  async execute(data: {
    name: string;
    price: number;
    durationInDays: number;
    doctorLimit: number;
    features: string[];
    isActive: boolean;
  }) {
    const exists = await this._planRepo.findByName(data.name.toLowerCase());
    if (exists) throw new Error("Plan already exists");

    return this._planRepo.create({
      ...data,
      name: data.name.toLowerCase(),
      isActive: data.isActive ? true : false,
      isDeleted: false,
    });
  }
}
