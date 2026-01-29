export function addMinutes(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function isTimeInRange(time: string, start?: string, end?: string): boolean {
  if (!start || !end) return false;

  const t = timeToMinutes(time);
  return t >= timeToMinutes(start) && t < timeToMinutes(end);
}

export const timeToMinutes = (time?: string): number => {
  console.log("The time reciced", time);
  if (!time) throw new Error("Invalid time value passed to timeToMinutes");

  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  return hours * 60 + minutes;
};

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export function getWeekDay(date: string): WeekDay {
  return new Date(date)
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase()
    .slice(0, 3) as WeekDay;
}

export function getCurrentISTMinutes(): number {
  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [hours, minutes] = now.split(":").map(Number);
  return hours * 60 + minutes;
}
