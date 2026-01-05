export interface DoctorSlotEventPublisher {
  slotBooked(payload: { doctorId: string; date: string; startTime: string }): Promise<void>;
}
