// export interface IRescheduleAppointmentRequest
export interface IRescheduleAppointmentResponse {
  success: boolean;
  newAppointmentId: string;
}

export interface IRescheduleAppointmentUseCase {
  execute(
    appointmentId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ): Promise<IRescheduleAppointmentResponse>;
}
