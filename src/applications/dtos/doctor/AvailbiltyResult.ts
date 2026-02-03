export interface AffectedAppointmentInfo {
  appointmentId: string;
  date: string;
  startTime: string;
  endTime: string;
  patientName: string;
}

export interface AvailabilityCheckResult {
  canProceed: boolean;
  affectedAppointmentCount: number;
  affectedAppointments: AffectedAppointmentInfo[];
}
