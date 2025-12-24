import { IHospitalRepository } from "../../domain/repositories/IHospital.repo";
import { HospitalModel } from "../database/mongo/models/Hospital.model";

export class HospitalRepositoryImpl implements IHospitalRepository {
  async create(data: any) {
    const hospital = await HospitalModel.create(data);
    return this.map(hospital);
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
