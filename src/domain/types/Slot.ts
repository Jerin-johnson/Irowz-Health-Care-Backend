import { PatientSnapshot } from "./DoctorAppointment";

export interface Slot {
  startTime: string;
  endTime: string;
  available?: boolean;
  slots?: number;
}

export interface AppointmentLike {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: "BOOKED" | "PENDING";
  vistType?: string;
  patientSnapshot?: PatientSnapshot;
}
