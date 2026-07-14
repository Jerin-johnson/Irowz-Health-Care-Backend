import {
  Hospital,
  HospitalFilterOptions,
  HospitalPaginationOptions,
  IHospitalRepository,
} from "../../domain/repositories/IHospital.repo";
import { HospitalDocument, HospitalModel } from "../database/mongo/models/Hospital.model";

import { FlattenMaps } from "mongoose";

type HospitalLean = FlattenMaps<HospitalDocument>;

export class HospitalRepository implements IHospitalRepository {
  async create(data: Omit<Hospital, "id" | "createdAt" | "updatedAt">) {
    const hospital = await HospitalModel.create(data);
    return this.map(hospital);
  }

  async findByAdminUserId(userId: string): Promise<{ _id: string } | null> {
    const hospital = await HospitalModel.findOne({ userId: userId })
      .select("_id")
      .lean<{ _id: string }>();

    return hospital ?? null;
  }

  async BlockBYUserId(userId: string, status: boolean): Promise<void> {
    await HospitalModel.updateOne({ userId: userId }, { isBlocked: status });
  }
  async findByUserId(userId: string) {
    const hospital = await HospitalModel.findOne({ userId });
    return hospital ? this.map(hospital) : null;
  }

  async activateHospital(hospitalId: string) {
    await HospitalModel.findByIdAndUpdate(hospitalId, {
      isVerified: true,
      verifiedAt: new Date(),
    });
  }

  async getPaginated(
    filters: HospitalFilterOptions,
    pagination: HospitalPaginationOptions
  ): Promise<{
    data: Hospital[];
    total: number;
    totalHospitals: number;
    IsActiveHospitalCount: number;
  }> {
    const query: Record<string, unknown> = {};

    if (filters.isActive != undefined) query.isActive = filters.isActive;
    if (filters.city) query.city = filters.city;

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { registrationNumber: { $regex: filters.search, $options: "i" } },
      ];
    }
    console.log("the filter", filters);
    console.log(query);
    const [data, total, totalHospitals, IsActiveHospitalCount] = await Promise.all([
      HospitalModel.find(query)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ verifiedAt: -1 })
        .lean(),
      HospitalModel.countDocuments(query),
      HospitalModel.countDocuments({}),
      HospitalModel.countDocuments({ isBlocked: false }),
    ]);

    return { data, total, totalHospitals, IsActiveHospitalCount };
  }

  async update(id: string, data: Partial<Hospital>): Promise<Hospital | null> {
    const hospital = await HospitalModel.findOneAndUpdate({ userId: id }, { data }, { new: true });
    return hospital ? this.map(hospital) : null;
  }

  async findByHospitalId(hospitalId: string): Promise<Hospital | null> {
    return await HospitalModel.findOne({ _id: hospitalId });
  }

  // async findByHospitalId(hospitalId: string) {
  //   const hospital = await HospitalModel.findById(hospitalId).lean<HospitalLean>();

  //   return hospital ? this.map(hospital) : null;
  // }

  private map(doc: HospitalDocument | HospitalLean): Hospital {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      name: doc.name,
      registrationNumber: doc.registrationNumber,
      officialEmail: doc.officialEmail,
      phone: doc.phone,
      type: doc.type,
      licenseDocumentKey: doc.licenseDocumentKey,
      city: doc.city,
      state: doc.state,
      latitude: doc.latitude,
      longitude: doc.longitude,
      isVerified: doc.isVerified,
      verifiedAt: doc.verifiedAt,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
