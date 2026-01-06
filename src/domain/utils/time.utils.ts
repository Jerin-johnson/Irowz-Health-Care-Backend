export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(0, 0, 0, h, m + minutes);
  return date.toTimeString().slice(0, 5);
}

export function isTimeInRange(time: string, start?: string, end?: string): boolean {
  if (!start || !end) return false;
  return time >= start && time < end;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export function getWeekDay(date: string): WeekDay {
  const day = new Date(date)
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase()
    .slice(0, 3);

  return day as WeekDay;
}
