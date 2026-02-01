export function getDateOnly(date: Date): string {
  return date.toISOString().split("T")[0];
}
