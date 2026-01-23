import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";

export class GetDoctorAppoinmentQueueUsecase {
  constructor(private readonly _DoctorAppoinmentRepo: IDoctorAppointmentRepository) {}

  async execute(doctorId: string, date: string) {
    const appointments = await this._DoctorAppoinmentRepo.getDoctorAppointmentsForDay(
      doctorId,
      date
    );

    if (!appointments || appointments.length === 0) {
      return {
        currentAppointmentId: null,
        nextAppointmentId: null,
        stats: {
          totalToday: 0,
          completed: 0,
          pending: 0,
          inConsultation: 0,
          cancelled: 0,
        },
        appointments: [],
      };
    }

    const stats = {
      totalToday: appointments.length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      pending: appointments.filter((a) => a.status === "BOOKED").length,
      inConsultation: appointments.filter((a) => a.status === "STARTED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    };

    const current = appointments.find((a) => a.status === "STARTED");
    const waitingQueue = appointments.filter((a) => a.status === "BOOKED");

    const next = current ? null : (waitingQueue[0] ?? null);

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
      nextAppointmentId: next?._id ?? null,
      stats,
      appointments: list,
    };
  }
}
