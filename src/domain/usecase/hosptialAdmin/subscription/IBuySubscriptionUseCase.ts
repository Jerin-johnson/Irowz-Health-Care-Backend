import { HospitalSubscriptionDocument } from "../../../../infrastructure/database/mongo/models/HospitalSubscription.model";

export interface BuySubscriptionInput {
  hospitalId: string;
  planId: string;

  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;

  superAdminId: string;
}

export interface IBuySubscriptionUseCase {
  execute(payload: BuySubscriptionInput): Promise<HospitalSubscriptionDocument>;
}
