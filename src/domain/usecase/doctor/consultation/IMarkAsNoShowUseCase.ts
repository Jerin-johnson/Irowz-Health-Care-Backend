export interface IMarkAsNoShowUseCase {
  execute(appointmentId: string, doctorId: string): Promise<{ message: string }>;
}
