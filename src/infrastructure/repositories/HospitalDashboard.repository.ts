import mongoose from "mongoose";
import {
  DashboardOverviewDTO,
  IHospitalDashboardRepository,
  MonthlyPatientStatDTO,
  MonthlyRevenueStatDTO,
} from "../../domain/repositories/IHospitalDashboard.repo";

import { HospitalSubscriptionModel } from "../database/mongo/models/HospitalSubscription.model";
import { DoctorModel } from "../database/mongo/models/Doctor.model";
import { HospitalSpecialtyModel } from "../database/mongo/models/HospitalSpeciality.model";
import { DoctorAppointmentModel } from "../database/mongo/models/DoctorAppointmentModel";

interface SubscriptionPopulated {
  planId: {
    name: string;
  };
  doctorLimitSnapshot: number;
  priceSnapshot: number;
  startDate: Date;
  endDate: Date;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
}

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

export class HospitalDashboardMongoRepository implements IHospitalDashboardRepository {
  async getOverview(hospitalId: string, userId: string): Promise<DashboardOverviewDTO> {
    const hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);

    const subscription = await HospitalSubscriptionModel.findOne({
      hospitalId: userId,
      status: "ACTIVE",
    })
      .populate<SubscriptionPopulated>("planId", "name")
      .lean();

    const doctors = await DoctorModel.countDocuments({
      hospitalId,
      isActive: true,
    });

    const specialties = await HospitalSpecialtyModel.countDocuments({
      hospitalId,
      isActive: true,
    });

    const appointments = await DoctorAppointmentModel.countDocuments({
      hospitalId,
    });

    const uniquePatients = await DoctorAppointmentModel.distinct("patientId", { hospitalId });

    const patients = uniquePatients.length;

    const rawPatientGrowth: { _id: number; patients: number }[] =
      await DoctorAppointmentModel.aggregate([
        { $match: { hospitalId: hospitalObjectId } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            patients: { $addToSet: "$patientId" },
          },
        },
        {
          $project: {
            _id: 1,
            patients: { $size: "$patients" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

    const patientGrowth: MonthlyPatientStatDTO[] = rawPatientGrowth.map((m) => ({
      month: m._id,
      label: MONTHS[m._id],
      patients: m.patients,
    }));

    const rawRevenue: { _id: number; revenue: number }[] = await DoctorAppointmentModel.aggregate([
      {
        $match: {
          hospitalId: hospitalObjectId,
          status: "COMPLETED",
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revenueStats: MonthlyRevenueStatDTO[] = rawRevenue.map((r) => ({
      month: r._id,
      label: MONTHS[r._id],
      revenue: r.revenue,
    }));

    return {
      subscription: subscription
        ? {
            planName: subscription.planId.name,
            doctorLimit: subscription.doctorLimitSnapshot,
            price: subscription.priceSnapshot,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            status: subscription.status,
          }
        : null,

      totals: {
        doctors,
        specialties,
        patients,
        appointments,
      },

      patientGrowth,
      revenueStats,
    };
  }
}
