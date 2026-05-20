import { Types } from "mongoose";
import { IDoctorAppointmentRepository } from "../../domain/repositories/IDoctorAppointmentRepository";
import { AppointmentFilterDTO, DoctorAppointment } from "../../domain/types/DoctorAppointment";
import {
  DoctorAppointmentDocument,
  DoctorAppointmentModel,
} from "../database/mongo/models/DoctorAppointmentModel";

export class DoctorAppointmentRepository implements IDoctorAppointmentRepository {
  async findByDoctorAndDate(
    doctorId: string,
    date: string
  ): Promise<
    {
      _id?: string | Types.ObjectId;
      startTime: string;
      endTime: string;
      status: "BOOKED" | "PENDING";
      visitType?: string;
      patientSnapshot?: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
      };
    }[]
  > {
    const result = await DoctorAppointmentModel.find({
      doctorId,
      date,
      status: { $in: ["BOOKED", "PENDING"] },
    }).select("startTime endTime status _id visitType patientSnapshot");

    return result as {
      _id?: string | Types.ObjectId;
      startTime: string;
      endTime: string;
      status: "BOOKED" | "PENDING";
      visitType?: string;
      patientSnapshot?: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
      };
    }[];
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

  async create(input: Partial<DoctorAppointment>): Promise<DoctorAppointmentDocument> {
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

  async findById(id: string): Promise<DoctorAppointmentDocument | null> {
    return await DoctorAppointmentModel.findById(id).lean();
  }

  async findByIdNoLean(id: string): Promise<DoctorAppointmentDocument | null> {
    return await DoctorAppointmentModel.findById(id);
  }
  async getDoctorAppointmentsForDay(doctorId: string, date: string) {
    return DoctorAppointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
      date,
    })
      .sort({ queuePriority: 1 })
      .lean();
  }

  async findActiveConsultation(
    doctorId: string,
    date: string
  ): Promise<DoctorAppointmentDocument | null> {
    return DoctorAppointmentModel.findOne({
      doctorId: new Types.ObjectId(doctorId),
      date,
      status: "STARTED",
    });
  }

  async startConsultation(appointmentId: string) {
    return DoctorAppointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        $set: {
          status: "STARTED",
          startedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  async getNextPatients(doctorId: string, date: string, limit = 2) {
    return DoctorAppointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
      date,
      status: "BOOKED",
    })
      .sort({ queuePriority: 1 })
      .limit(limit)
      .lean();
  }

  async findAppointmentsByPatient(filters: AppointmentFilterDTO) {
    const { patientId, status, date, page = 1, limit = 10 } = filters;

    const query: any = {
      patientId: new Types.ObjectId(patientId),
    };

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (date) {
      query.date = date; // frontend sends YYYY-MM-DD
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      DoctorAppointmentModel.find(query)
        .populate({
          path: "doctorId",
          populate: {
            path: "userId",
            select: "name email phone profileImage",
          },
          select: "userId specialtyId",
        })
        .sort({ date: -1, startTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      DoctorAppointmentModel.countDocuments(query),
    ]);

    return {
      data,
      total,
    };
  }

  async markCompleted(id: string, completedAt: Date): Promise<void> {
    await DoctorAppointmentModel.findByIdAndUpdate(id, {
      status: "COMPLETED",
      completedAt,
    });
  }

  async lastAppointment(id: string): Promise<DoctorAppointmentDocument | null> {
    const today = new Date();
    const yestard = new Date();
    yestard.setDate(today.getDate() - 1);
    const previous = yestard.setDate(yestard.getDate() - 1);

    return await DoctorAppointmentModel.findOne({
      patientId: id,
      updatedAt: { $in: [today, yestard, previous] },
    });
  }

  async getMaxQueuePriority({ doctorId, date }: { doctorId: string; date: string }) {
    const last = await DoctorAppointmentModel.findOne({
      doctorId,
      date,
      status: { $in: ["BOOKED", "NO_SHOW"] },
    })
      .sort({ queuePriority: -1 })
      .select("queuePriority");

    return last?.queuePriority || 0;
  }

  async markNoShow({
    appointmentId,
    newPriority,
    markedAt,
  }: {
    appointmentId: string;
    newPriority: number;
    markedAt: Date;
  }) {
    await DoctorAppointmentModel.findByIdAndUpdate(appointmentId, {
      status: "NO_SHOW",
      queuePriority: newPriority,
      noShowMarkedAt: markedAt,
    });
  }

  save(appointment: DoctorAppointmentDocument) {
    return appointment.save();
  }

  async findFutureBookedAppointments(doctorId: string): Promise<DoctorAppointmentDocument[]> {
    const today = new Date().toISOString().slice(0, 10);

    return DoctorAppointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
      date: { $gte: today },
      status: "BOOKED",
    }).exec();
  }

  async markAvailabilityAffected(appointmentIds: string[]): Promise<void> {
    await DoctorAppointmentModel.updateMany(
      { _id: { $in: appointmentIds.map((id) => new Types.ObjectId(id)) } },
      {
        $set: {
          availabilityAffected: {
            isAffected: true,
            affectedAt: new Date(),
            reason: "DOCTOR_AVAILABILITY_CHANGED",
          },
        },
      }
    );
  }
  async findByUserIdCompelted(userId: string): Promise<DoctorAppointmentDocument | null> {
    return await DoctorAppointmentModel.findOne({ patientId: userId, status: "COMPLETED" });
  }

  async checkBookingForPaticularDoctor(doctorId: string, patientId: string): Promise<boolean> {
    const checkCancellationFOrPaticularDoctor = await DoctorAppointmentModel.countDocuments({
      doctorId,
      patientId,
      status: "CANCELLED",
    });

    console.log(checkCancellationFOrPaticularDoctor);

    if (checkCancellationFOrPaticularDoctor > 5) {
      return false;
    }
    return true;
  }
}
