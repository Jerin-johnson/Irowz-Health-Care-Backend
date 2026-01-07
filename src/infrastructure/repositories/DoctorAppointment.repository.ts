import { IDoctorAppointmentRepository } from "../../domain/repositories/IDoctorAppointmentRepository";
import { DoctorAppointment } from "../../domain/types/DoctorAppointment";
import { DoctorAppointmentModel } from "../database/mongo/models/DoctorAppointmentModel";

export class DoctorAppointmentRepository implements IDoctorAppointmentRepository {
  async findByDoctorAndDate(
    doctorId: string,
    date: string
  ): Promise<{ startTime: string; endTime: string; status: "BOOKED" | "PENDING" }[]> {
    const result = await DoctorAppointmentModel.find({
      doctorId,
      date,
      status: { $in: ["BOOKED", "PENDING"] },
    }).select("startTime endTime status");

    return result as { startTime: string; endTime: string; status: "BOOKED" | "PENDING" }[];
  }

  async exists(doctorId: string, date: string, startTime: string): Promise<boolean> {
    const result = await DoctorAppointmentModel.findOne({
      doctorId,
      date,
      startTime,
      status: { $in: ["BOOKED", "PENDING", "COMPLETED"] },
    });

    if (!result) return false;

    return true;
  }

  async create(input: Partial<DoctorAppointment>): Promise<any> {
    const appoinement = new DoctorAppointmentModel(input);

    return appoinement.save();
  }

  async attachPaymentOrder(appointmentId: string, razorpayOrderId: string): Promise<void> {
    await DoctorAppointmentModel.updateOne({ _id: appointmentId }, { $set: { razorpayOrderId } });
  }
  async markPaid(params: {
    razorpayOrderId: string;
    transactionId: string;
  }): Promise<{ doctorId: string; date: string }> {
    const { razorpayOrderId, transactionId } = params;

    const appointment = await DoctorAppointmentModel.findOne({
      razorpayOrderId,
    });

    if (!appointment) {
      throw new Error("Appointment not found for Razorpay order");
    }

    /**
     * Idempotency check (VERY IMPORTANT)
     * Razorpay may retry webhooks multiple times
     */
    if (appointment.paymentStatus === "PAID") {
      return {
        doctorId: appointment.doctorId.toString(),
        date: appointment.date,
      };
    }

    /**
     * Update appointment state
     */
    appointment.paymentStatus = "PAID";
    appointment.status = "BOOKED";
    appointment.transactionId = transactionId;

    await appointment.save();

    return {
      doctorId: appointment.doctorId.toString(),
      date: appointment.date,
    };
  }
}
