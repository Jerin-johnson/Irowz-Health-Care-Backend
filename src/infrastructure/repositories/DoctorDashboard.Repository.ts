import mongoose from "mongoose";
import {
  DoctorDashboardOverviewDTO,
  IDoctorDashboardRepository,
  MonthlyAppointmentStatDTO,
} from "./IDoctorDashboard.repo";
import { DoctorAppointmentModel } from "../database/mongo/models/DoctorAppointmentModel";
import { DoctorReviewModel } from "../database/mongo/models/DoctorReview.model";

const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export class DoctorDashboardMongoRepository implements IDoctorDashboardRepository {
  async getOverview(doctorId: string): Promise<DoctorDashboardOverviewDTO> {
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    const totalAppointments = await DoctorAppointmentModel.countDocuments({
      doctorId,
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthAppointments = await DoctorAppointmentModel.countDocuments({
      doctorId,
      createdAt: { $gte: startOfMonth },
    });

    const rawMonthly: { _id: number; appointments: number }[] =
      await DoctorAppointmentModel.aggregate([
        { $match: { doctorId: doctorObjectId } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            appointments: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

    const monthlyTrend: MonthlyAppointmentStatDTO[] = rawMonthly.map((m) => ({
      month: m._id,
      label: MONTHS[m._id],
      appointments: m.appointments,
    }));

    const rawRating = await DoctorReviewModel.aggregate([
      { $match: { doctorId: doctorObjectId, isActive: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const ratingData = rawRating[0] ?? { averageRating: 0, totalReviews: 0 };

    return {
      totalAppointments,
      thisMonthAppointments,
      monthlyTrend,
      rating: {
        averageRating: Number(ratingData.averageRating?.toFixed(2) ?? 0),
        totalReviews: ratingData.totalReviews,
      },
    };
  }
}
