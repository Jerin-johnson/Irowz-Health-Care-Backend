import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IGetDoctorProfileUseCase } from "../../../../domain/usecase/doctor/doctorProfile/IGetDoctorProfileUseCase.usecase";

export class GetDoctorProfileUseCase implements IGetDoctorProfileUseCase {
  constructor(private readonly _DoctorRepo: IDoctorRepository) {}

  async execute(doctorId: string) {
    const doctorProfile = await this._DoctorRepo.findById(doctorId);
    return doctorProfile;
  }
}
