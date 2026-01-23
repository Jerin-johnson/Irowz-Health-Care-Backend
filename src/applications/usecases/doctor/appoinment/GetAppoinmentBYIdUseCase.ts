import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { toAppointmentDto } from "../../../dtos/doctor/appointment.mapper";

export class GetAppoinmentBYIdUseCase {
  constructor(private readonly _DoctorAppoinmentRepo: IDoctorAppointmentRepository) {}

  async execute(id: string) {
    const result = await this._DoctorAppoinmentRepo.findById(id);
    return toAppointmentDto(result);
  }
}
