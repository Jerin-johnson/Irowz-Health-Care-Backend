import { DashboardOverviewDTO } from "../../../repositories/IHospitalDashboard.repo";

export interface IGetHospitalDashboardOverviewUseCase {
  execute(hospitalId: string, userId: string): Promise<DashboardOverviewDTO>;
}
