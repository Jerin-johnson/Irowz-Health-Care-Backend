import { AppointmentFilterDTO, AppointmentListResult } from "../../../types/DoctorAppointment";

export interface IGetPatientAppointmentsUseCase {
  execute(filters: AppointmentFilterDTO): Promise<AppointmentListResult>;
}
