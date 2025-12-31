import { IHospitalVerificationRepository } from "../../../../domain/repositories/IHospitalVerification.repo";

import { HosptialRequestVerficationStatus } from "../../../../domain/constants/HosptialRequestVerficationStatus";
import { IGetHospitalStatsUseCase } from "../../../../domain/usecase/superAdmin/hospitalVerfication/IGetHospitalStatsUseCase.usecase";

export class GetHospitalStatsUseCase implements IGetHospitalStatsUseCase {
  constructor(private readonly repository: IHospitalVerificationRepository) {}

  async execute() {
    const [pending, approvedToday, rejected] = await Promise.all([
      this.repository.countByStatus(HosptialRequestVerficationStatus.PENDING),
      this.repository.countApprovedToday(),
      this.repository.countByStatus(HosptialRequestVerficationStatus.REJECTED),
    ]);

    return {
      pending,
      approvedToday,
      rejected,
    };
  }
}
