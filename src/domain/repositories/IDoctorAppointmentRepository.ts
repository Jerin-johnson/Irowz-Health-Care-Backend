export interface IDoctorAppointmentRepository {
  findByDoctorAndDate(
    doctorId: string,
    date: string
  ): Promise<
    {
      startTime: string;
      endTime: string;
      status: "BOOKED" | "PENDING";
    }[]
  >;
}
