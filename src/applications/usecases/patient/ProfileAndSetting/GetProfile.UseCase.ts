import { IPatientProfileRepository } from "../../../../domain/repositories/IPatientProfileRepository";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { mapPatientProfileToDTO } from "../../../dtos/patient/PatientProfileOutputDto";

export class GetProfileUseCase {
  constructor(
    private _PatientProfileRepository: IPatientProfileRepository,
    private _UserRepo: IUserRepository
  ) {}

  async execute(userId: string) {
    const user = await this._UserRepo.findById(userId);

    if (!user) throw new Error("The user Not exist...");

    const patientProfile = await this._PatientProfileRepository.findByUserId(userId);

    return mapPatientProfileToDTO(user, patientProfile);
  }
}
