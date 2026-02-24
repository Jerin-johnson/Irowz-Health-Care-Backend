import { IDoctorDashboardRepository } from "../../../../domain/repositories/IDoctorDashboard.repo";
import { IGetDoctorDashboardOverviewUseCase } from "../../../../domain/usecase/doctor/dashborad/IGetDoctorDashboardOverviewUseCase";

export class GetDoctorDashboardOverviewUseCase implements IGetDoctorDashboardOverviewUseCase {
  constructor(private readonly repo: IDoctorDashboardRepository) {}

  async execute(doctorId: string) {
    if (!doctorId) {
      throw new Error("Doctor ID required");
    }

    return this.repo.getOverview(doctorId);
  }
}
