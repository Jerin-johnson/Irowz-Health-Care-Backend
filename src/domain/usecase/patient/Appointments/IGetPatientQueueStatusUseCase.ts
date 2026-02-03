import { ObjectId } from "mongoose";

export type AppointmentStatus =
  | "PENDING"
  | "BOOKED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW"
  | "STARTED";

export type PatientState =
  | "ONGOING"
  | "NEXT"
  | "WAITING"
  | "NOT_IN_QUEUE"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type DoctorStatus = "NOT_STARTED" | "CONSULTING" | "ON_LUNCH_BREAK";

export interface IGetPatientQueueStatusUseCase {
  execute(
    appointmentId: string,
    today: string
  ): Promise<{
    appointmentId: string | ObjectId;

    status: AppointmentStatus;

    patientState?: string;

    doctorStatus?: DoctorStatus;

    queuePosition?: number | null;

    patientsAhead?: number | null;

    estimatedWaitMinutes: number | null;

    message?: string;

    patientInfo?: {
      name?: string;
      appointmentDate: string;
      appointmentTime: string;
    };
  }>;
}
