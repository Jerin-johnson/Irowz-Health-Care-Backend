import { Types } from "mongoose";
import { SubscriptionPlanDocument } from "../../../../infrastructure/database/mongo/models/SubscriptionPlan.model";

export interface GetActivePlansForListingResult {
  plans: SubscriptionPlanDocument[];
  activePlanId?: Types.ObjectId | string;
}

export interface IGetActivePlansForListingHospitalAdminUseCase {
  execute(hospitalId: string): Promise<GetActivePlansForListingResult>;
}
