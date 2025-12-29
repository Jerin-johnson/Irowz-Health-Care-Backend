import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { IHospitalSpecialty } from "../../../../infrastructure/database/mongo/models/HospitalSpeciality.model";

interface CreateHospitalSpecialtyDTO {
  hospitalId: string;
  name: string;
  description: string;
}

export class AddHospitalSpecialtyUseCase {
  constructor(
    private readonly specialtyRepository: IHospitalSpecialtyRepository
  ) {}

  async execute(data: CreateHospitalSpecialtyDTO): Promise<IHospitalSpecialty> {
    if (!data.name.trim()) {
      throw new Error("Specialty name is required");
    }

    if (!data.description.trim()) {
      throw new Error("Specialty description is required");
    }

    const specialty = await this.specialtyRepository.create({
      hospitalId: data.hospitalId as any,
      name: data.name,
      description: data.description,
      isActive: true,
    });

    return specialty;
  }
}
