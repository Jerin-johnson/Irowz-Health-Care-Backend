import { Types } from "mongoose";
import { IDoctorAvailabilityRepository } from "../../domain/repositories/IDoctorAvailabilityRepository";
import { DoctorAvailability } from "../../domain/types/DoctorAvailability";
import { DoctorAvailabilityModel } from "../database/mongo/models/DoctorAvailabilityModel";
import { DoctorAvailabilityMapper } from "../mapper/DoctorAvailabilityMapper";

export class MongoDoctorAvailabilityRepository implements IDoctorAvailabilityRepository {
  async findByDoctorId(doctorId: string): Promise<DoctorAvailability | null> {
    const doc = await DoctorAvailabilityModel.findOne({ doctorId }).exec();

    if (!doc) return null;

    return DoctorAvailabilityMapper.toDomain(doc);
  }

  async create(
    availability: Omit<DoctorAvailability, "id" | "createdAt" | "updatedAt">
  ): Promise<DoctorAvailability> {
    const doc = await DoctorAvailabilityModel.create({
      ...availability,
      doctorId: availability.doctorId,
    });

    return DoctorAvailabilityMapper.toDomain(doc);
  }

  async updateByDoctorId(
    doctorId: string,
    availability: Partial<DoctorAvailability>
  ): Promise<DoctorAvailability> {
    const doc = await DoctorAvailabilityModel.findOneAndUpdate({ doctorId }, availability, {
      new: true,
    }).exec();

    if (!doc) {
      throw new Error("Doctor availability not found");
    }

    return DoctorAvailabilityMapper.toDomain(doc);
  }

  async getByDoctorIds(doctorIds: Types.ObjectId[]) {
    const records = await DoctorAvailabilityModel.find({
      doctorId: { $in: doctorIds },
    }).lean();

    const map = new Map<string, any>();
    records.forEach((r) => {
      map.set(r.doctorId.toString(), r);
    });

    return map;
  }
}
