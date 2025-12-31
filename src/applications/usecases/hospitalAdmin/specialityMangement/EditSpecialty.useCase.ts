import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { IEditSpecialityUseCase } from "../../../../domain/usecase/hosptialAdmin/specialityMangement/IEditSpecialityUseCase.usecase";

export class EditSpecialityUseCase implements IEditSpecialityUseCase {
  constructor(
    private readonly specialtyRepository: IHospitalSpecialtyRepository
  ) {}

  async execute(
    specialtyId: string,
    hospitalId: string,
    data: { name: string; description: string }
  ) {
    const updated = await this.specialtyRepository.updateById(
      specialtyId,
      hospitalId,
      data
    );

    if (!updated) {
      throw new Error("Specialty not found");
    }

    return { message: "Blocked the hospital successfully" };
  }
}
