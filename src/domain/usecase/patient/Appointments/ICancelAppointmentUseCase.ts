export interface ICancelAppointmentUseCase {
  execute(appointmentId: string): Promise<{
    success: boolean;
    refundIssued: boolean;
  }>;
}
