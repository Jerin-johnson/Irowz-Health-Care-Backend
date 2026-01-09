import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { IEditSpecialityUseCase } from "../../../../domain/usecase/hosptialAdmin/specialityMangement/IEditSpecialityUseCase.usecase";

export class EditSpecialityUseCase implements IEditSpecialityUseCase {
  constructor(private readonly specialtyRepository: IHospitalSpecialtyRepository) {}

  async execute(
    specialtyId: string,
    hospitalId: string,
    data: { name: string; description: string; symptoms: string[] }
  ) {
    const normalizedSymptoms = Array.from(
      new Set(data.symptoms.map((s) => s.trim().toLowerCase()).filter(Boolean))
    );

    if (normalizedSymptoms.length === 0) {
      throw new Error("Symptoms cannot be empty");
    }
    const updated = await this.specialtyRepository.updateById(specialtyId, hospitalId, {
      ...data,
      symptoms: normalizedSymptoms,
    });

    if (!updated) {
      throw new Error("Specialty not found");
    }

    return { message: "updated speciality  hospital successfully" };
  }
}
