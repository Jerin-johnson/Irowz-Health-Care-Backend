export interface DoctorBlockedDateRepository {
  isDateBlocked(doctorId: string, date: string): Promise<boolean>;
}
