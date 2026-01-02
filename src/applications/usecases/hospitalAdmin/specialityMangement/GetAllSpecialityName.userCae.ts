import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { IGetAllSpecialtyNameUseCase } from "../../../../domain/usecase/hosptialAdmin/specialityMangement/IGetAllSpecialtyNameUseCase.usecase";

export class GetAllSpecialtyNameUseCase implements IGetAllSpecialtyNameUseCase {
  constructor(private HospitalSpeicalityRepo: IHospitalSpecialtyRepository) {}

  async execute(hospitalId: string) {
    const result = await this.HospitalSpeicalityRepo.getAllSpeciality(hospitalId);
    return result;
  }
}
