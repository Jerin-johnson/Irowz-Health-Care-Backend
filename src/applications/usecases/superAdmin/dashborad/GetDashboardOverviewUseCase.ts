import { ISuperAdminDashboardRepo } from "../../../../domain/repositories/ISuperAdminDashboardRepo";
import { IGetFullDashboardOverviewUseCase } from "../../../../domain/usecase/superAdmin/dashboard/IGetFullDashboardOverviewUseCase";

export class GetFullDashboardOverviewUseCase implements IGetFullDashboardOverviewUseCase {
  constructor(private repo: ISuperAdminDashboardRepo) {}

  async execute() {
    const [
      totalUsers,
      totalDoctors,
      totalHospitals,
      activeSubscriptions,
      totalRevenue,
      monthlyRevenue,
      expiringSoon,
      newHospitalsThisMonth,
      monthlyRevenueGraph,
      userTrends,
    ] = await Promise.all([
      this.repo.getTotalUsers(),
      this.repo.getTotalDoctors(),
      this.repo.getTotalHospitals(),
      this.repo.getActiveSubscriptions(),
      this.repo.getTotalRevenue(),
      this.repo.getMonthlyRevenue(),
      this.repo.getExpiringSoon(7),
      this.repo.getNewHospitalsThisMonth(),
      this.repo.getMonthlyRevenueGraph(),
      this.repo.getUserTrendsByRole(),
    ]);

    const lastMonthRevenue =
      monthlyRevenueGraph.length >= 2
        ? monthlyRevenueGraph[monthlyRevenueGraph.length - 2].amount
        : 0;

    const revenueGrowthPercent =
      lastMonthRevenue === 0 ? 100 : ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    return {
      kpis: {
        totalUsers,
        totalDoctors,
        totalHospitals,
        activeSubscriptions,
        monthlyRevenue,
        totalRevenue,
      },
      alerts: { expiringSoon },
      growth: {
        newHospitalsThisMonth,
        revenueGrowthPercent: Number(revenueGrowthPercent.toFixed(2)),
      },
      charts: {
        monthlyRevenue: monthlyRevenueGraph,
        userTrends,
      },
    };
  }
}
