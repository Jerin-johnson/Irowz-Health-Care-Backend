import { AppointmentDto } from "../../../../applications/dtos/doctor/appointment.mapper";

export interface IGetAppointmentByIdUseCase {
  execute(id: string): Promise<AppointmentDto>;
}
