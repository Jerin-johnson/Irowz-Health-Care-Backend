import { DoctorLean } from "../../../../infrastructure/database/mongo/models/Doctor.model";

export interface IGetDoctorProfileUseCase {
  execute(doctorId: string): Promise<DoctorLean | null>;
}
