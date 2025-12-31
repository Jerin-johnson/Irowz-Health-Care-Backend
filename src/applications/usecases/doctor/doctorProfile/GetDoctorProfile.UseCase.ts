import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";

export class GetDoctorProfileUseCase {
  constructor(private readonly _DoctorRepo: IDoctorRepository) {}

  async execute(doctorId: string) {
    const doctorProfile = await this._DoctorRepo.findById(doctorId);
    return doctorProfile;
  }
}
