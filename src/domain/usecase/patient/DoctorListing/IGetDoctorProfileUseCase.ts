import { DoctorLean } from "../../../../infrastructure/database/mongo/models/Doctor.model";

export interface GetDoctorProfileUseCase {
  execute(doctorId: string): Promise<DoctorLean>;
}
