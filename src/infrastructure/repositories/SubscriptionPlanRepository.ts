import { ISubscriptionPlanRepository } from "../../domain/repositories/ISubscriptionPlanRepository";
import {
  SubscriptionPlanDocument,
  SubscriptionPlanModel,
} from "../database/mongo/models/SubscriptionPlan.model";
import { BaseRepository } from "./base/Base.repository";

export class SubscriptionPlanRepository
  extends BaseRepository<
    Partial<SubscriptionPlanDocument>,
    Partial<SubscriptionPlanDocument>,
    SubscriptionPlanDocument
  >
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlanModel);
  }

  findActivePlans() {
    return SubscriptionPlanModel.find({ isDeleted: false }).exec();
  }

  findByName(name: string): Promise<SubscriptionPlanDocument | null> {
    return SubscriptionPlanModel.findOne({ name }).exec();
  }

  findPlanForListing(): Promise<SubscriptionPlanDocument[]> {
    return SubscriptionPlanModel.find({ isDeleted: false, isActive: true }).exec();
  }
}
