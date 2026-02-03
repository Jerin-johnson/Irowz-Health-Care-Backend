import { PatientProfileDTO } from "../../../../applications/dtos/patient/PatientProfileOutputDto";

export interface IGetProfileUseCase {
  execute(userId: string): Promise<PatientProfileDTO>;
}
