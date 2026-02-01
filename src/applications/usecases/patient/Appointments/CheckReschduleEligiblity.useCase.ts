import { DoctorAppointmentRepository } from "../../../../infrastructure/repositories/DoctorAppointment.repository";
import { getDateOnly } from "../../../utils/getDayOnly";

export class CheckRescheduleEligibilityUseCase {
  constructor(private appointmentRepo: DoctorAppointmentRepository) {}

  async execute(appointmentId: string) {
    const appt = await this.appointmentRepo.findById(appointmentId);

    console.log("sdfsdfn dsn f", appt);

    if (!appt) throw new Error("Appointment not found");

    if (appt.isRescheduleAppointment) {
      return { canReschedule: false, reason: "Already rescheduled once" };
    }

    if (["STARTED", "COMPLETED", "NO_SHOW"].includes(appt.status)) {
      return { canReschedule: false };
    }

    const bookingDate = getDateOnly(appt.createdAt);
    const today = getDateOnly(new Date());

    const refundAllowed = bookingDate === today;

    return {
      canReschedule: refundAllowed,
      refundAllowed,
      refundAmount: refundAllowed ? appt.totalAmount : 0,
    };
  }
}
