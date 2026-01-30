export interface UpdateMedicalRecordInput {
  appointmentId: string;

  diagnosisSummary?: string;
  clinicalObservations?: string;

  medications?: {
    name: string;
    dosage: string;
    dosageUnit: string;
    duration: number;
    durationUnit: string;
    instructions?: string;
  }[];

  followUpDate?: string;

  markCompleted?: boolean;
}
