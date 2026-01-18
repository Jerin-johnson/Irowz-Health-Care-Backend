import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IAppointmentSuccessOrFailureUseCase } from "../../../../domain/usecase/patient/BookingSlots/IAppointmentSuccessOrFailure";
import { DoctorProfileMapper } from "../../../dtos/doctor/doctorProfile.mapper";

export class ApponintmentSuccessOrFailureUseCase implements IAppointmentSuccessOrFailureUseCase {
  constructor(
    private readonly _DoctorAppointmentRepo: IDoctorAppointmentRepository,
    private readonly _DoctorRepo: IDoctorRepository
  ) {}

  async execute(appoinementId: string) {
    const result = await this._DoctorAppointmentRepo.findById(appoinementId);
    if (!result?.doctorId) throw new Error("DoctorId does exist wtf");
    const doctor = await this._DoctorRepo.findById(String(result?.doctorId));

    const { fullName, hospitalName, specialtyName } = DoctorProfileMapper.toView(doctor);

    return { ...result, doctorName: fullName, hospitalName, specialtyName };
  }
}
