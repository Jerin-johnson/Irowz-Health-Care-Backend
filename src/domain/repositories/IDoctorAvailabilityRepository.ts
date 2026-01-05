import { DoctorAvailability } from "../types/DoctorAvailability";

export interface IDoctorAvailabilityRepository {
  findByDoctorId(doctorId: string): Promise<DoctorAvailability | null>;

  create(
    availability: Omit<DoctorAvailability, "id" | "createdAt" | "updatedAt">
  ): Promise<DoctorAvailability>;

  updateByDoctorId(
    doctorId: string,
    availability: Partial<DoctorAvailability>
  ): Promise<DoctorAvailability>;
}
