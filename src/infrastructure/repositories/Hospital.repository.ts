import { IHospitalRepository } from "../../domain/repositories/IHospital.repo";
import { HospitalModel } from "../database/mongo/models/Hospital.model";

export class HospitalRepositoryImpl implements IHospitalRepository {
  async create(data: any) {
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

  async getPaginated(filters: any, pagination: any) {
    const query: any = {};

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
    const [data, total, totalHospitals, IsActiveHospitalCount] =
      await Promise.all([
        HospitalModel.find(query)
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort({ submittedAt: -1 })
          .lean(),
        HospitalModel.countDocuments(query),
        HospitalModel.countDocuments({}),
        HospitalModel.countDocuments({ isBlocked: false }),
      ]);

    return { data, total, totalHospitals, IsActiveHospitalCount };
  }

  private map(doc: any) {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      name: doc.name,
      registrationNumber: doc.registrationNumber,
      officialEmail: doc.officialEmail,
      phone: doc.phone,
      type: doc.type,
      licenseDocumentUrl: doc.licenseDocumentUrl,
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
