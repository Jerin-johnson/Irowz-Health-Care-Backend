import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";

export class GetDoctorAppoinmentQueueUsecase {
  constructor(private readonly _DoctorAppoinmentRepo: IDoctorAppointmentRepository) {}

  async execute(doctorId: string, date: string) {
    const appointments = await this._DoctorAppoinmentRepo.getDoctorAppointmentsForDay(
      doctorId,
      date
    );

    if (!appointments) throw new Error("No appoinment for today");

    const stats = {
      totalToday: appointments.length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      pending: appointments.filter((a) => a.status === "BOOKED").length,
      inConsultation: appointments.filter((a) => a.status === "STARTED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    };

    const current = appointments.find((a) => a.status === "STARTED");

    const list = appointments.map((a) => ({
      appointmentId: a._id,
      startTime: a.startTime,
      patientName: `${a.patientSnapshot.firstName} ${a.patientSnapshot.lastName}`,
      visitType: a.visitType,
      status: a.status,
      queuePriority: a.queuePriority,
    }));

    return {
      currentAppointmentId: current?._id ?? null,
      stats,
      appointments: list,
    };
  }
}
