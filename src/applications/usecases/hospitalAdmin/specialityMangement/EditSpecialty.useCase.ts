import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";

export class EditSpecialityUseCase {
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
