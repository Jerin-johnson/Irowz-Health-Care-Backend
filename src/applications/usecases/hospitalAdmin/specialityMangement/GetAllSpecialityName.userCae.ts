import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";

export class GetAllSpecialtyNameUseCase {
  constructor(private HospitalSpeicalityRepo: IHospitalSpecialtyRepository) {}

  async execute(hospitalId: string) {
    const result =
      await this.HospitalSpeicalityRepo.getAllSpeciality(hospitalId);
    return result;
  }
}
