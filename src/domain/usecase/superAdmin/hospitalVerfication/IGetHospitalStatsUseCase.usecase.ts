export interface IGetHospitalStatsUseCase {
  execute(): Promise<{
    pending: number;
    approvedToday: number;
    rejected: number;
  }>;
}
