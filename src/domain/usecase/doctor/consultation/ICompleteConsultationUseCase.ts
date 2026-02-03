export interface ICompleteConsultationUseCase {
  execute(appointmentId: string, doctorId: string): Promise<{ message: string }>;
}
