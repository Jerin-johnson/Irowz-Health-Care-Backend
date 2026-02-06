import { IDoctorDashboardRepository } from "../../../../infrastructure/repositories/IDoctorDashboard.repo";

export class GetDoctorDashboardOverviewUseCase {
  constructor(private readonly repo: IDoctorDashboardRepository) {}

  async execute(doctorId: string) {
    if (!doctorId) {
      throw new Error("Doctor ID required");
    }

    return this.repo.getOverview(doctorId);
  }
}
