export interface Slot {
  startTime: string; // "10:15"
  endTime: string; // "10:30"
  status: "AVAILABLE" | "BOOKED" | "BLOCKED";
}
