import { DoctorAppointmentQueueResponse } from "../../../types/GetDoctorAppointmentQueue.types";

export interface IGetDoctorAppointmentQueueUseCase {
  execute(doctorId: string, date: string): Promise<DoctorAppointmentQueueResponse>;
}
