export interface Slot {
  startTime: string;
  endTime: string;
}

export interface AppointmentLike {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: "BOOKED" | "PENDING";
}
