import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import { DoctorAvailability } from "../../../../domain/types/DoctorAvailability";
import { IUpsertDoctorAvailabilityUseCase } from "../../../../domain/usecase/doctor/doctorAvailbility/IUpsertDoctorAvailabilityUseCase";

export class UpsertDoctorAvailabilityUseCase implements IUpsertDoctorAvailabilityUseCase {
  constructor(private readonly _availabilityRepo: IDoctorAvailabilityRepository) {}

  async execute(
    doctorId: string,
    input: Omit<DoctorAvailability, "id" | "doctorId" | "createdAt" | "updatedAt">
  ): Promise<DoctorAvailability> {
    const existing = await this._availabilityRepo.findByDoctorId(doctorId);

    if (existing) {
      return this._availabilityRepo.updateByDoctorId(doctorId, {
        ...input,
        updatedAt: new Date(),
      });
    }

    return this._availabilityRepo.create({
      doctorId,
      ...input,
    });
  }
}
