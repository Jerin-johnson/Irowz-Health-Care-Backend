import { Types } from "mongoose";
import { BaseRepository } from "./base/Base.repository";
import { IPatientProfile } from "../../domain/types/IPatientProfile";
import { IPatientProfileRepository } from "../../domain/repositories/IPatientProfileRepository";
import { PatientProfile } from "../database/mongo/models/Patient.model";

export class PatientProfileRepository
  extends BaseRepository<Partial<IPatientProfile>, Partial<IPatientProfile>, IPatientProfile>
  implements IPatientProfileRepository
{
  constructor() {
    super(PatientProfile);
  }

  async findByUserId(userId: Types.ObjectId | string): Promise<IPatientProfile | null> {
    return PatientProfile.findOne({ userId });
  }

  async updateByUserId(
    userId: Types.ObjectId | string,
    data: Partial<IPatientProfile>
  ): Promise<IPatientProfile | null> {
    return PatientProfile.findOneAndUpdate({ userId }, { $set: data }, { new: true, upsert: true });
  }
}
