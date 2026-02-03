import { PatientProfileInputDTO } from "../../../../applications/usecases/patient/ProfileAndSetting/EditPatientProfileUseCase";

export interface IEditPatientProfileUseCase {
  execute(
    userId: string,
    input: PatientProfileInputDTO,
    file?: Express.Multer.File
  ): Promise<{
    message: string;
  }>;
}
