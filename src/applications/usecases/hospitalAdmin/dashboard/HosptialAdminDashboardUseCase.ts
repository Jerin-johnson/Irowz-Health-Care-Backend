import { IHospitalDashboardRepository } from "../../../../domain/repositories/IHospitalDashboard.repo";

export class GetHospitalDashboardOverviewUseCase {
  constructor(private readonly _HospitalDashboardRepository: IHospitalDashboardRepository) {}

  async execute(hospitalId: string, userId: string) {
    return this._HospitalDashboardRepository.getOverview(hospitalId, userId);
  }
}
