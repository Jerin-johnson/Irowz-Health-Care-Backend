export interface AppointmentSuccessResponseDTO {
  _id: string;

  doctorId: string;
  patientId: string;
  hospitalId?: string;

  doctorName: string;
  hospitalName: string;
  specialtyName: string;

  appointmentDate: string;

  appointmentStatus: "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "STARTED";

  startTime: string;
  endTime: string;

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED"
    | "CANCELLED"
    | "EXPIRED";

  visitType: "OPD" | "ONLINE";

  createdAt: Date;
}
export interface IAppointmentSuccessOrFailureUseCase {
  execute(appointmentId: string): Promise<AppointmentSuccessResponseDTO>;
}
