export interface DoctorAvailability {
  id: string;
  doctorId: string;

  weeklySchedule: {
    day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
    isWorking: boolean;

    workingHours?: {
      start: string; // HH:mm
      end: string; // HH:mm
    };

    breakTime?: {
      start: string;
      end: string;
    };
  }[];

  doctorDelayMinutes: number;
  doctorDelayedAt?: Date;
  doctorDelayReason?: string;

  slotDurationMinutes: number;

  maxPatientsPerDay: number;

  teleConsultationEnabled: boolean;
  timezone: string;

  createdAt: Date;
  updatedAt: Date;
}

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface WorkingHours {
  start: string;
  end: string;
}

export interface BreakTime {
  start: string;
  end: string;
}

export interface WeeklyScheduleItem {
  day: WeekDay;
  isWorking: boolean;
  workingHours?: WorkingHours;
  breakTime?: BreakTime;
}
