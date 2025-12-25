import { HospitalVerificationModel } from "../database/mongo/models/HospitalVerification.model";
import {
  HospitalVerification,
  HospitalVerificationStatus,
  IHospitalVerificationRepository,
  ResumbitHospitalVerficationRepository,
} from "../../domain/repositories/IHospitalVerification.repo";
import mongoose from "mongoose";

export class HospitalVerificationRepositoryImpl implements IHospitalVerificationRepository {
  async create(data: any) {
    const record = await HospitalVerificationModel.create(data);
    return this.map(record);
  }

  async findPendingByUserId(userId: string) {
    const record = await HospitalVerificationModel.findOne({
      userId,
      status: "PENDING",
    });
    return record ? this.map(record) : null;
  }

  async findById(id: string) {
    const record = await HospitalVerificationModel.findById(id);
    return record ? this.map(record) : null;
  }

  async updateStatus(
    id: string,
    status: "APPROVED" | "REJECTED",
    adminRemarks?: string
  ) {
    const result = await HospitalVerificationModel.findByIdAndUpdate(
      id,
      {
        status,
        adminRemarks,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!result) return;

    return this.map(result);
  }

  async findAllPending(status = "PENDING", search: string) {
    let query = { status };
    if (search) {
      // query.hos;
      console.log(search);
    }
    const records = await HospitalVerificationModel.find({
      status: "PENDING",
    });
    return records.map(this.map);
  }

  async resumbit(
    userId: string,
    input: Partial<ResumbitHospitalVerficationRepository>
  ): Promise<HospitalVerification> {
    const record = await HospitalVerificationModel.findOneAndUpdate(
      { userId },
      { ...input }
    );
    return this.map(record);
  }

  async update(id: string, data: Partial<HospitalVerification>): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(id);
    console.log("what is that", data);
    const updated = await HospitalVerificationModel.findOneAndUpdate(
      { _id: objectId },
      { licenseDocumentUrl: data.licenseDocumentUrl }
    );
    console.log("This was success");
    if (!updated) {
      throw new Error(`Hospital verification not found for id ${id}`);
    }
  }

  async findHosptialVerficationStatus(
    hositpalId: string
  ): Promise<HospitalVerificationStatus | null> {
    const status = await HospitalVerificationModel.findOne({
      _id: hositpalId,
    }).select("status");

    if (!status) return null;

    return status.status;
  }

  private map(doc: any) {
    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      hospitalName: doc.hospitalName,
      registrationNumber: doc.registrationNumber,
      hospitalAddress: doc.hospitalAddress,
      city: doc.city,
      state: doc.state,
      pincode: doc.pincode,
      officialEmail: doc.officialEmail,
      phone: doc.phone,
      licenseDocumentUrl: doc.licenseDocumentUrl,
      status: doc.status,
      adminRemarks: doc.adminRemarks,
      submittedAt: doc.submittedAt,
      reviewedAt: doc.reviewedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
