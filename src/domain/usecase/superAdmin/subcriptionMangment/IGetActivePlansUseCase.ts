import { SubscriptionPlanDocument } from "../../../../infrastructure/database/mongo/models/SubscriptionPlan.model";

export interface IGetActivePlansUseCase {
  execute(): Promise<SubscriptionPlanDocument[]>;
}
