export interface DoctorAppointmentQueueStats {
  totalToday: number;
  completed: number;
  pending: number;
  inConsultation: number;
  cancelled: number;
}

export interface DoctorAppointmentQueueItem {
  appointmentId: string;
  startTime: string;
  patientName: string;
  visitType: "OPD" | "ONLINE";
  status: "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "STARTED";
  queuePriority: number;
}

export interface DoctorAppointmentQueueResponse {
  currentAppointmentId: string | null;
  nextAppointmentId: string | null;
  stats: DoctorAppointmentQueueStats;
  appointments: DoctorAppointmentQueueItem[];
}
