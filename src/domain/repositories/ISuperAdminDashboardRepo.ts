export interface ISuperAdminDashboardRepo {
  getTotalUsers(): Promise<number>;
  getTotalDoctors(): Promise<number>;
  getTotalHospitals(): Promise<number>;
  getActiveSubscriptions(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getMonthlyRevenue(): Promise<number>;

  getExpiringSoon(days: number): Promise<number>;
  getNewHospitalsThisMonth(): Promise<number>;

  getMonthlyRevenueGraph(): Promise<{ month: string; amount: number }[]>;

  getUserTrendsByRole(): Promise<{
    patients: { month: string; count: number }[];
    doctors: { month: string; count: number }[];
    hospitals: { month: string; count: number }[];
  }>;
}
