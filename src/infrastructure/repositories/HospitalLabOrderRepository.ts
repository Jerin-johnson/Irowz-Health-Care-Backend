import { Types } from "mongoose";
import { IHospitalLabOrderRepository } from "../../domain/repositories/IHospitalLabOrderRepository";
import {
  HospitalLabOrderDocument,
  HospitalLabOrderModel,
} from "../database/mongo/models/HospitalLabOrder.model";

export class HospitalLabOrderRepository implements IHospitalLabOrderRepository {
  async createOrder(data: {
    appointmentId: string;
    patientId: string;
    doctorId: string;
    hospitalId: string;
    tests: { testName: string; category: string }[];
    clinicalReason?: string;
  }) {
    await HospitalLabOrderModel.create({
      appointmentId: new Types.ObjectId(data.appointmentId),
      patientId: new Types.ObjectId(data.patientId),
      hospitalId: new Types.ObjectId(data.hospitalId),
      doctorId: new Types.ObjectId(data.doctorId),
      tests: data.tests,
      clinicalReason: data.clinicalReason,
    });
  }

  async findByAppointmentId(appointmentId: string): Promise<HospitalLabOrderDocument | null> {
    return await HospitalLabOrderModel.findOne({ appointmentId });
  }

  async save(hospitalDocument: HospitalLabOrderDocument): Promise<void> {
    await hospitalDocument.save();
  }

  async findWithPagination(params: {
    hospitalId: string;
    page: number;
    limit: number;
    status?: "PENDING" | "RESULT_UPLOADED";
  }) {
    const filter: { hospitalId: Types.ObjectId; status?: "PENDING" | "RESULT_UPLOADED" } = {
      hospitalId: new Types.ObjectId(params.hospitalId),
    };

    if (params.status) {
      filter.status = params.status;
    }

    const skip = (params.page - 1) * params.limit;

    const [data, total] = await Promise.all([
      HospitalLabOrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit)
        .populate("patientId", "name"),
      HospitalLabOrderModel.countDocuments(filter),
    ]);

    return { data, total };
  }

  async findById(orderId: string) {
    return HospitalLabOrderModel.findById(orderId);
  }

  async markCompleted(orderId: string) {
    await HospitalLabOrderModel.updateOne(
      { _id: new Types.ObjectId(orderId) },
      { status: "RESULT_UPLOADED" }
    );
  }
}
