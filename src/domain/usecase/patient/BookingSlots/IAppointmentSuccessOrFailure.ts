export interface IAppointmentSuccessOrFailureUseCase {
  execute(appointmentId: string): Promise<any>;
}
