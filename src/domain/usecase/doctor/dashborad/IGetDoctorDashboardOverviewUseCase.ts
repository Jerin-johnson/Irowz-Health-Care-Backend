import { DoctorDashboardOverviewDTO } from "../../../repositories/IDoctorDashboard.repo";

export interface IGetDoctorDashboardOverviewUseCase {
  execute(doctorId: string): Promise<DoctorDashboardOverviewDTO>;
}
