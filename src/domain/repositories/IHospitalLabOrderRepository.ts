import { HospitalLabOrderDocument } from "../../infrastructure/database/mongo/models/HospitalLabOrder.model";

export interface IHospitalLabOrderRepository {
  createOrder(data: {
    appointmentId: string;
    patientId: string;
    doctorId: string;
    hospitalId: string;

    tests: {
      testName: string;
      category: string;
    }[];

    clinicalReason?: string;
  }): Promise<void>;

  findByAppointmentId(appointmentId: string): Promise<HospitalLabOrderDocument | null>;

  findWithPagination(params: {
    hospitalId: string;
    page: number;
    limit: number;
    status?: "PENDING" | "RESULT_UPLOADED";
  }): Promise<{
    data: HospitalLabOrderDocument[];
    total: number;
  }>;

  findById(orderId: string): Promise<HospitalLabOrderDocument | null>;

  markCompleted(orderId: string): Promise<void>;

  save(hospitalDocument: HospitalLabOrderDocument): Promise<void>;
}
