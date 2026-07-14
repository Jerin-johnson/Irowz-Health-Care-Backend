import { HospitalVerification } from "../../../repositories/IHospitalVerification.repo";

export interface IGetVerificationRequestByIdUseCase {
  execute(hospitalVerificationId: string): Promise<HospitalVerification | null>;
}
