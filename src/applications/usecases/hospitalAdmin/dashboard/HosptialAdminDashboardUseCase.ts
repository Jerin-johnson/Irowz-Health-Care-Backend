import { IHospitalDashboardRepository } from "../../../../domain/repositories/IHospitalDashboard.repo";
import { IGetHospitalDashboardOverviewUseCase } from "../../../../domain/usecase/hosptialAdmin/dashboard/IGetHospitalDashboardOverviewUseCase";

export class GetHospitalDashboardOverviewUseCase implements IGetHospitalDashboardOverviewUseCase {
  constructor(private readonly _HospitalDashboardRepository: IHospitalDashboardRepository) {}

  async execute(hospitalId: string, userId: string) {
    return this._HospitalDashboardRepository.getOverview(hospitalId, userId);
  }
}
