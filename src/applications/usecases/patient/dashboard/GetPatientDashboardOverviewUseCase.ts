import { IPatientDashboardRepository } from "../../../../domain/repositories/IPatientDashboard.repo";

export class GetPatientDashboardOverviewUseCase {
  constructor(private readonly repo: IPatientDashboardRepository) {}

  async execute(patientId: string, userId: string) {
    return this.repo.getOverview(patientId, userId);
  }
}
