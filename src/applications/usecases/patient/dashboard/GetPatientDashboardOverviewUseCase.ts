import { IPatientDashboardRepository } from "../../../../domain/repositories/IPatientDashboard.repo";
import { IGetPatientDashboardOverviewUseCase } from "../../../../domain/usecase/patient/dashboard/IGetPatientDashboardOverviewUseCase";

export class GetPatientDashboardOverviewUseCase implements IGetPatientDashboardOverviewUseCase {
  constructor(private readonly repo: IPatientDashboardRepository) {}

  async execute(patientId: string, userId: string) {
    return this.repo.getOverview(patientId, userId);
  }
}
