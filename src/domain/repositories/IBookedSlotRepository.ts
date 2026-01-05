export interface BookedSlotRepository {
  findBookedSlots(
    doctorId: string,
    date: string
  ): Promise<
    {
      startTime: string;
      endTime: string;
    }[]
  >;

  exists(doctorId: string, date: string, startTime: string): Promise<boolean>;

  create(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    appointmentId: string
  ): Promise<void>;
}
