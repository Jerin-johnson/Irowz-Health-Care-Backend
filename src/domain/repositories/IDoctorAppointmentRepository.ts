import { DoctorAppointmentDocument } from "../../infrastructure/database/mongo/models/DoctorAppointmentModel";
import {
  AppointmentFilterDTO,
  AppointmentListResult,
  DoctorAppointment,
} from "../types/DoctorAppointment";

export interface IDoctorAppointmentRepository {
  findByDoctorAndDate(
    doctorId: string,
    date: string
  ): Promise<
    {
      _id?: any;
      startTime: string;
      endTime: string;
      status: "BOOKED" | "PENDING";
      visitType?: string;
      patientSnapshot?: any;
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

  getDoctorAppointmentsForDay(doctorId: string, date: string): Promise<DoctorAppointmentDocument[]>;

  findActiveConsultation(doctorId: string, date: string): Promise<DoctorAppointmentDocument | null>;

  startConsultation(appointmentId: string): Promise<any>;

  getNextPatients(
    doctorId: string,
    date: string,
    limit: number
  ): Promise<Partial<DoctorAppointment>[] | any>;

  findAppointmentsByPatient(filters: AppointmentFilterDTO): Promise<AppointmentListResult>;
}
