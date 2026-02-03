import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IGetDoctorProfileUseCase } from "../../../../domain/usecase/doctor/doctorProfile/IGetDoctorProfileUseCase.usecase";

export class GetDoctorProfileUseCase implements IGetDoctorProfileUseCase {
  constructor(private readonly _DoctorRepo: IDoctorRepository) {}

  async execute(doctorId: string) {
    const doctor = await this._DoctorRepo.findById(doctorId);

    if (!doctor) throw new Error("cannot able to find doctor");
    return doctor;
  }
}
