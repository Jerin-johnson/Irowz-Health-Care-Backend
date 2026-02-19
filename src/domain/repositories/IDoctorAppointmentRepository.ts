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

  findFutureBookedAppointments(doctorId: string): Promise<DoctorAppointmentDocument[]>;

  markPaid(params: { appointmentId: string; transactionId: string }): Promise<{
    doctorId: string;
    date: string;
  }>;

  findById(id: string): Promise<DoctorAppointmentDocument | null>;

  findByIdNoLean(id: string): Promise<DoctorAppointmentDocument | null>;

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

  markCompleted(id: string, completedAt: Date): Promise<void>;

  lastAppointment(id: string): Promise<DoctorAppointmentDocument | null>;

  getMaxQueuePriority(params: { doctorId: string; date: string }): Promise<number>;

  markNoShow(params: { appointmentId: string; newPriority: number; markedAt: Date }): Promise<void>;

  save(appointment: DoctorAppointmentDocument): Promise<DoctorAppointmentDocument>;

  markAvailabilityAffected(appointmentIds: string[]): Promise<void>;

  findByUserIdCompelted(userId: string): Promise<DoctorAppointmentDocument | null>;

  checkBookingForPaticularDoctor(doctorId: string, patientId: string): Promise<boolean>;
}
