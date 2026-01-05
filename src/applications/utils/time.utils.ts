export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(0, 0, 0, h, m + minutes);
  return date.toTimeString().slice(0, 5);
}

export function isTimeInRange(time: string, start?: string, end?: string): boolean {
  if (!start || !end) return false;
  return time >= start && time < end;
}
