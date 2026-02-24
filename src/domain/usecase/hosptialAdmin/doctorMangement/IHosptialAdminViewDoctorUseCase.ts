import { DoctorLean } from "../../../../infrastructure/database/mongo/models/Doctor.model";

export interface IHosptialAdminViewDoctorUseCase {
  execute(doctorId: string): Promise<DoctorLean>;
}
