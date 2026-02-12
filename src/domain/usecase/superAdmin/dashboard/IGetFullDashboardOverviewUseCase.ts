export interface MonthlyRevenuePoint {
  month: string;
  amount: number;
}

export interface DashboardOverviewResult {
  kpis: {
    totalUsers: number;
    totalDoctors: number;
    totalHospitals: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    totalRevenue: number;
  };
  alerts: {
    expiringSoon: number;
  };
  growth: {
    newHospitalsThisMonth: number;
    revenueGrowthPercent: number;
  };
  charts: {
    monthlyRevenue: MonthlyRevenuePoint[];
  };
}

export interface IGetFullDashboardOverviewUseCase {
  execute(): Promise<DashboardOverviewResult>;
}
