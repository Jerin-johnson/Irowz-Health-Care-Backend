import { IBaseRepository } from "./base/IBaseRepository";
import { SubscriptionPlanDocument } from "../../infrastructure/database/mongo/models/SubscriptionPlan.model";

export interface ISubscriptionPlanRepository extends IBaseRepository<
  Partial<SubscriptionPlanDocument>,
  Partial<SubscriptionPlanDocument>,
  SubscriptionPlanDocument
> {
  findActivePlans(): Promise<SubscriptionPlanDocument[]>;
  findByName(name: string): Promise<SubscriptionPlanDocument | null>;
  findPlanForListing(): Promise<SubscriptionPlanDocument[]>;
}
