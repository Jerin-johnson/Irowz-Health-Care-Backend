export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface TimeRange {
  start: string; // HH:mm (24h)
  end: string; // HH:mm (24h)
}

export interface WeeklySchedule {
  day: WeekDay;
  isWorking: boolean;

  workingHours?: TimeRange;

  breakTime?: TimeRange;
}
