import { IPatientProfileRepository } from "../../../../domain/repositories/IPatientProfileRepository";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IGetProfileUseCase } from "../../../../domain/usecase/patient/Profile&settings/IGetProfileUseCase";
import { mapPatientProfileToDTO, PatientProfileDTO } from "../../../mapper/patientProfile.mapper";
// import {
//   mapPatientProfileToDTO,
//   PatientProfileDTO,
// } from "../../../dtos/patient/PatientProfileOutputDto";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(
    private _PatientProfileRepository: IPatientProfileRepository,
    private _UserRepo: IUserRepository
  ) {}

  async execute(userId: string): Promise<PatientProfileDTO> {
    const user = await this._UserRepo.findById(userId);

    if (!user) throw new Error("The user Not exist...");

    const patientProfile = await this._PatientProfileRepository.findByUserId(userId);

    return mapPatientProfileToDTO(user, patientProfile);
  }
}
