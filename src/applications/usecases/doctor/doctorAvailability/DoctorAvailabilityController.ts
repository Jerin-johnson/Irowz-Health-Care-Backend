import { IDoctorAvailabilityRepository } from "../../../../domain/repositories/IDoctorAvailabilityRepository";
import { DoctorAvailability } from "../../../../domain/types/DoctorAvailability";

export class UpsertDoctorAvailabilityUseCase {
  constructor(private readonly availabilityRepo: IDoctorAvailabilityRepository) {}

  async execute(
    doctorId: string,
    input: Omit<DoctorAvailability, "id" | "doctorId" | "createdAt" | "updatedAt">
  ): Promise<DoctorAvailability> {
    const existing = await this.availabilityRepo.findByDoctorId(doctorId);

    if (existing) {
      return this.availabilityRepo.updateByDoctorId(doctorId, {
        ...input,
        updatedAt: new Date(),
      });
    }

    return this.availabilityRepo.create({
      doctorId,
      ...input,
    });
  }
}
