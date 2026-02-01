export interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  diagnosisSummary: string;
  hospitalName: string;
  visitType: string;
}

export function mapMedicalRecordToDTO(record: any): MedicalRecord {
  return {
    id: record._id.toString(),
    date: record.visitDate.toISOString(),
    doctorName: record.doctorId?.userId?.name ?? "—",
    diagnosisSummary: record.diagnosisSummary ?? "—",
    hospitalName: record.hospitalId?.name ?? "—",
    visitType: record.visitType,
  };
}
