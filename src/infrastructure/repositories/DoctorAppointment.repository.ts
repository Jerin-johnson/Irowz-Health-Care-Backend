import { IDoctorAppointmentRepository } from "../../domain/repositories/IDoctorAppointmentRepository";
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
}
