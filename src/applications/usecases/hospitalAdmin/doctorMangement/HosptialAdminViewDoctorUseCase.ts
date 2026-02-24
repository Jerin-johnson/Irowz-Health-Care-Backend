import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IHosptialAdminViewDoctorUseCase } from "../../../../domain/usecase/hosptialAdmin/doctorMangement/IHosptialAdminViewDoctorUseCase";

export class HosptialAdminViewDoctorUseCase implements IHosptialAdminViewDoctorUseCase {
  constructor(private readonly _DoctorRepository: IDoctorRepository) {}

  async execute(doctorId: string) {
    const doctor = await this._DoctorRepository.findById(doctorId);

    if (!doctor) throw new Error("Doctor not found");

    console.log("Doctor details:", doctor);
    return doctor;
  }
}
