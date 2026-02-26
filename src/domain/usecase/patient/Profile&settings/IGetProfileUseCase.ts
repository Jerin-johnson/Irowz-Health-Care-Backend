import { PatientProfileDTO } from "../../../../applications/mapper/patientProfile.mapper";

export interface IGetProfileUseCase {
  execute(userId: string): Promise<PatientProfileDTO>;
}
