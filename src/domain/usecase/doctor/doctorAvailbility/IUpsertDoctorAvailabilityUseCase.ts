import { DoctorAvailability } from "../../../types/DoctorAvailability";

export type UpsertDoctorAvailabilityInput = Omit<
  DoctorAvailability,
  "id" | "doctorId" | "createdAt" | "updatedAt"
>;

export interface IUpsertDoctorAvailabilityUseCase {
  execute(doctorId: string, input: UpsertDoctorAvailabilityInput): Promise<DoctorAvailability>;
}
