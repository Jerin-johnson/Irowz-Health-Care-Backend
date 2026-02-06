import { IHospitalSubscriptionRepository } from "../../domain/repositories/IHospitalSubscriptionRepository";
import {
  HospitalSubscriptionDocument,
  HospitalSubscriptionModel,
} from "../database/mongo/models/HospitalSubscription.model";
import { BaseRepository } from "./base/Base.repository";

export class HospitalSubscriptionRepository
  extends BaseRepository<
    Partial<HospitalSubscriptionDocument>,
    Partial<HospitalSubscriptionDocument>,
    HospitalSubscriptionDocument
  >
  implements IHospitalSubscriptionRepository
{
  constructor() {
    super(HospitalSubscriptionModel);
  }

  findActiveByHospital(hospitalId: string) {
    return HospitalSubscriptionModel.findOne({
      hospitalId,
      status: "ACTIVE",
      endDate: { $gte: new Date() },
    }).exec();
  }

  async expireOldSubscriptions(): Promise<void> {
    await HospitalSubscriptionModel.updateMany(
      { endDate: { $lt: new Date() }, status: "ACTIVE" },
      { status: "EXPIRED" }
    );
  }

  async save(HospitalSubscription: HospitalSubscriptionDocument) {
    return await HospitalSubscription.save();
  }

  // findCurrent(hospitalId: string) {
  //   return HospitalSubscriptionModel.findOne({
  //     hospitalId,
  //     status: "ACTIVE",
  //     endDate: { $gte: new Date() },
  //   });
  // }
}
