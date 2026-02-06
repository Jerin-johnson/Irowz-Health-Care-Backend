import {
  IPatientDashboardRepository,
  PatientDashboardOverviewDTO,
  UpcomingAppointmentDTO,
  ActionRequiredDTO,
  BMIDTO,
} from "../../domain/repositories/IPatientDashboard.repo";

import { DoctorAppointmentModel } from "../database/mongo/models/DoctorAppointmentModel";
import { PatientProfile } from "../database/mongo/models/Patient.model";

export class PatientDashboardMongoRepository implements IPatientDashboardRepository {
  async getOverview(patientId: string, userId: string): Promise<PatientDashboardOverviewDTO> {
    const today = new Date().toISOString().split("T")[0];

    const upcoming = await DoctorAppointmentModel.find({
      patientId: userId,
      date: { $gte: today },
      status: { $in: ["PENDING", "BOOKED", "STARTED", "NO_SHOW"] },
    })
      .sort({ date: 1, startTime: 1 })
      .lean();

    const upcomingAppointments: UpcomingAppointmentDTO[] = upcoming.map((a) => ({
      appointmentId: a._id.toString(),
      doctorId: a.doctorId.toString(),
      date: a.date,
      startTime: a.startTime,
      visitType: a.visitType,
      status: a.status,
    }));

    const actionsRequired: ActionRequiredDTO[] = [];

    for (const a of upcoming) {
      if (a.availabilityAffected?.isAffected) {
        actionsRequired.push({
          appointmentId: a._id.toString(),
          reason: "AVAILABILITY_CHANGED",
          message: "Doctor schedule changed — please reschedule",
        });
      }

      if (a.paymentStatus === "FAILED") {
        actionsRequired.push({
          appointmentId: a._id.toString(),
          reason: "PAYMENT_FAILED",
          message: "Payment failed — complete payment",
        });
      }

      if (a.noShowMarkedAt) {
        actionsRequired.push({
          appointmentId: a._id.toString(),
          reason: "NO_SHOW",
          message: "Marked as no-show — contact support if incorrect",
        });
      }
    }

    const [total, completed, cancelled, noShow] = await Promise.all([
      DoctorAppointmentModel.countDocuments({ patientId: userId }),
      DoctorAppointmentModel.countDocuments({ patientId: userId, status: "COMPLETED" }),
      DoctorAppointmentModel.countDocuments({ patientId: userId, status: "CANCELLED" }),
      DoctorAppointmentModel.countDocuments({ patientId: userId, status: "NO_SHOW" }),
    ]);

    const profile = await PatientProfile.findOne({ userId: userId }).lean();

    let bmiResult: PatientDashboardOverviewDTO["bmi"] = null;

    if (profile?.height && profile?.weight) {
      const heightMeters = profile.height / 100;
      const bmiValue = Number((profile.weight / (heightMeters * heightMeters)).toFixed(2));

      let category: BMIDTO["category"];

      if (bmiValue < 18.5) category = "UNDERWEIGHT";
      else if (bmiValue < 25) category = "NORMAL";
      else if (bmiValue < 30) category = "OVERWEIGHT";
      else category = "OBESE";

      bmiResult = {
        value: bmiValue,
        category,
      };
    }

    return {
      upcomingAppointments,
      actionsRequired,
      stats: {
        total,
        completed,
        cancelled,
        noShow,
      },
      bmi: bmiResult,
    };
  }
}
