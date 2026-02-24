import { PatientDashboardOverviewDTO } from "../../../repositories/IPatientDashboard.repo";

export interface IGetPatientDashboardOverviewUseCase {
  execute(patientId: string, userId: string): Promise<PatientDashboardOverviewDTO>;
}
