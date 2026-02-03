import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IGetAppointmentByIdUseCase } from "../../../../domain/usecase/doctor/appoinments/IGetAppointmentByIdUseCase";
import { toAppointmentDto } from "../../../dtos/doctor/appointment.mapper";

export class GetAppoinmentBYIdUseCase implements IGetAppointmentByIdUseCase {
  constructor(private readonly _DoctorAppoinmentRepo: IDoctorAppointmentRepository) {}

  async execute(id: string) {
    const result = await this._DoctorAppoinmentRepo.findById(id);

    if (!result) throw new Error("something went wrong in appointmemt get");

    console.log("the result is ", result);
    return toAppointmentDto(result);
  }
}
