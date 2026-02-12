import { SubscriptionPlanDocument } from "../../../../infrastructure/database/mongo/models/SubscriptionPlan.model";

export interface ICreateSubscriptionPlanUseCase {
  execute(data: {
    name: string;
    price: number;
    durationInDays: number;
    doctorLimit: number;
    features: string[];
    isActive: boolean;
  }): Promise<Partial<SubscriptionPlanDocument> | null>;
}
