import { HospitalSubscriptionDocument } from "../../infrastructure/database/mongo/models/HospitalSubscription.model";
import { IBaseRepository } from "./base/IBaseRepository";

export interface IHospitalSubscriptionRepository extends IBaseRepository<
  Partial<HospitalSubscriptionDocument>,
  Partial<HospitalSubscriptionDocument>,
  HospitalSubscriptionDocument
> {
  findActiveByHospital(hospitalId: string): Promise<HospitalSubscriptionDocument | null>;

  expireOldSubscriptions(): Promise<void>;

  save(HospitalSubscription: HospitalSubscriptionDocument): Promise<HospitalSubscriptionDocument>;

  // findCurrent(hospitalId: string): Promise<HospitalSubscriptionDocument | null>;
}
