import { DoctorAppointmentDocument } from "../../infrastructure/database/mongo/models/DoctorAppointmentModel";
import { DoctorAppointment } from "../types/DoctorAppointment";

export interface IDoctorAppointmentRepository {
  findByDoctorAndDate(
    doctorId: string,
    date: string
  ): Promise<
    {
      startTime: string;
      endTime: string;
      status: "BOOKED" | "PENDING";
    }[]
  >;

  exists(doctorId: string, date: string, startTime: string): Promise<boolean>;

  create(input: Partial<DoctorAppointment>): Promise<any>;

  attachPaymentOrder(appointmentId: string, razorpayOrderId: string): Promise<void>;

  markPaid(params: { appointmentId: string; transactionId: string }): Promise<{
    doctorId: string;
    date: string;
  }>;

  findById(id: string): Promise<Partial<DoctorAppointmentDocument> | null>;

  findPendingByUser(
    doctorId: string,
    patientId: string,
    date: string,
    startTime: string
  ): Promise<any>;
}
