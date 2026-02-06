export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface SubscriptionOverviewDTO {
  planName: string;
  doctorLimit: number;
  price: number;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
}

export interface TotalsDTO {
  doctors: number;
  specialties: number;
  patients: number;
  appointments: number;
}

export interface MonthlyPatientStatDTO {
  month: number;
  label: string;
  patients: number;
}

export interface MonthlyRevenueStatDTO {
  month: number;
  label: string;
  revenue: number;
}

export interface DashboardOverviewDTO {
  subscription: SubscriptionOverviewDTO | null;
  totals: TotalsDTO;
  patientGrowth: MonthlyPatientStatDTO[];
  revenueStats: MonthlyRevenueStatDTO[];
}

export interface IHospitalDashboardRepository {
  getOverview(hospitalId: string, userId: string): Promise<DashboardOverviewDTO>;
}
