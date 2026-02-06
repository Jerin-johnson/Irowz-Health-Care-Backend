export interface MonthlyAppointmentStatDTO {
  month: number;
  label: string;
  appointments: number;
}

export interface DoctorRatingDTO {
  averageRating: number;
  totalReviews: number;
}

export interface DoctorDashboardOverviewDTO {
  totalAppointments: number;
  thisMonthAppointments: number;
  monthlyTrend: MonthlyAppointmentStatDTO[];
  rating: DoctorRatingDTO;
}

export interface IDoctorDashboardRepository {
  getOverview(doctorId: string): Promise<DoctorDashboardOverviewDTO>;
}
