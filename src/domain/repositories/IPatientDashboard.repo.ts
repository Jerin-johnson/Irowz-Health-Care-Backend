export interface UpcomingAppointmentDTO {
  appointmentId: string;
  doctorId: string;
  date: string;
  startTime: string;
  visitType: "OPD" | "ONLINE";
  status: string;
}

export interface ActionRequiredDTO {
  appointmentId: string;
  reason: string;
  message: string;
}

export interface AppointmentStatsDTO {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface BMIDTO {
  value: number;
  category: "UNDERWEIGHT" | "NORMAL" | "OVERWEIGHT" | "OBESE";
}

export interface PatientDashboardOverviewDTO {
  upcomingAppointments: UpcomingAppointmentDTO[];
  actionsRequired: ActionRequiredDTO[];
  stats: AppointmentStatsDTO;
  bmi: BMIDTO | null;
}

export interface IPatientDashboardRepository {
  getOverview(patientId: string, userId: string): Promise<PatientDashboardOverviewDTO>;
}
