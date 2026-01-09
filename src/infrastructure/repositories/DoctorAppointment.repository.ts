import { IDoctorAppointmentRepository } from "../../domain/repositories/IDoctorAppointmentRepository";
import { DoctorAppointment } from "../../domain/types/DoctorAppointment";
import {
  DoctorAppointmentDocument,
  DoctorAppointmentModel,
} from "../database/mongo/models/DoctorAppointmentModel";

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

  async findPendingByUser(doctorId: string, patientId: string, date: string, startTime: string) {
    return DoctorAppointmentModel.findOne({
      doctorId,
      patientId,
      date,
      startTime,
      status: "PENDING",
      paymentStatus: "PENDING",
    }).lean();
  }

  async exists(doctorId: string, date: string, startTime: string): Promise<boolean> {
    const result = await DoctorAppointmentModel.findOne({
      doctorId,
      date,
      startTime,
      $or: [
        { status: "BOOKED" },
        { status: "COMPLETED" },
        {
          paymentStatus: "PAID",
        },
      ],
    });

    return !!result;
  }

  async create(input: Partial<DoctorAppointment>): Promise<any> {
    const appoinement = new DoctorAppointmentModel(input);

    return appoinement.save();
  }

  async attachPaymentOrder(appointmentId: string, razorpayOrderId: string): Promise<void> {
    await DoctorAppointmentModel.updateOne({ _id: appointmentId }, { $set: { razorpayOrderId } });
  }

  async markPaid(params: {
    appointmentId: string;
    transactionId: string;
  }): Promise<{ doctorId: string; date: string }> {
    const { appointmentId, transactionId } = params;

    const appointment = await DoctorAppointmentModel.findOne({
      _id: appointmentId,
    });

    if (!appointment) {
      throw new Error("Appointment not found for Razorpay order");
    }

    if (appointment.paymentStatus === "PAID") {
      return {
        doctorId: appointment.doctorId.toString(),
        date: appointment.date,
      };
    }

    appointment.paymentStatus = "PAID";
    appointment.status = "BOOKED";
    appointment.transactionId = transactionId;

    await appointment.save();

    return {
      doctorId: appointment.doctorId.toString(),
      date: appointment.date,
    };
  }

  async findById(id: string): Promise<Partial<DoctorAppointmentDocument> | null> {
    const appoinement = await DoctorAppointmentModel.findById(id).lean();
    console.log(appoinement);
    return appoinement ? appoinement : null;
  }
}
