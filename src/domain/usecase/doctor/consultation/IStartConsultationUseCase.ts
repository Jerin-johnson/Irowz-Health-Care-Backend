export interface StartConsultationResult {
  appointmentId: string;
  status: "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "STARTED";
  startedAt?: Date;
  patientId: string;
  patientName: string;
  medicalRecordId: string;
}

export interface IStartConsultationUseCase {
  execute(appointmentId: string): Promise<StartConsultationResult>;
}
