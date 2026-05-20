import { Types } from "mongoose";
import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { IAddHospitalSpecialtyUseCase } from "../../../../domain/usecase/hosptialAdmin/specialityMangement/IAddHospitalSpecialtyUseCase.usecase";
import { IHospitalSpecialty } from "../../../../infrastructure/database/mongo/models/HospitalSpeciality.model";

interface CreateHospitalSpecialtyDTO {
  hospitalId: string;
  name: string;
  description: string;
  symptoms: string[];
}

export class AddHospitalSpecialtyUseCase implements IAddHospitalSpecialtyUseCase {
  constructor(private readonly specialtyRepository: IHospitalSpecialtyRepository) {}

  async execute(data: CreateHospitalSpecialtyDTO): Promise<IHospitalSpecialty> {
    if (!data.name.trim()) {
      throw new Error("Specialty name is required");
    }

    if (!data.description.trim()) {
      throw new Error("Specialty description is required");
    }

    const normalizedSymptoms = Array.from(
      new Set(data.symptoms.map((s) => s.trim().toLowerCase()).filter(Boolean))
    );

    if (normalizedSymptoms.length === 0) {
      throw new Error("Symptoms cannot be empty");
    }

    const specialty = await this.specialtyRepository.create({
      hospitalId: new Types.ObjectId(data.hospitalId),
      name: data.name,
      description: data.description,
      symptoms: normalizedSymptoms,
      isActive: true,
    });

    return specialty;
  }
}
