import UserRoles from "../../domain/constants/UserRole";
import { ISuperAdminDashboardRepo } from "../../domain/repositories/ISuperAdminDashboardRepo";
import { HospitalSubscriptionModel } from "../database/mongo/models/HospitalSubscription.model";
import User from "../database/mongo/models/User.model";
import { WalletModel } from "../database/mongo/models/Wallet";
import dotenv from "dotenv";
dotenv.config();

export class SuperAdminDashboardRepo implements ISuperAdminDashboardRepo {
  async getTotalUsers() {
    return User.countDocuments({ role: UserRoles.PATIENT, isVerified: true });
  }

  async getTotalDoctors() {
    return User.countDocuments({ role: UserRoles.DOCTOR, isVerified: true });
  }

  async getTotalHospitals() {
    return User.countDocuments({ role: UserRoles.HOSPITAL_ADMIN, isVerified: true });
  }

  async getActiveSubscriptions() {
    return HospitalSubscriptionModel.countDocuments({ status: "ACTIVE" });
  }

  // async getTotalRevenue() {
  //   // const res = await WalletModel.aggregate([
  //   //   { $match: { status: { $ne: "CANCELLED" } } },
  //   //   { $group: { _id: null, total: { $sum: "$priceSnapshot" } } },
  //   // ]);

  //   const res = await WalletModel.findOne({ userId: process.env.SUPER_ADMIN_ID }).lean();
  //   return res?.balance;
  // }

  async getTotalRevenue(): Promise<number> {
    const res = await WalletModel.findOne({ userId: process.env.SUPER_ADMIN_ID }).lean();
    return res?.balance || 0;
  }

  async getMonthlyRevenue() {
    const start = new Date();
    start.setDate(1);

    const res = await HospitalSubscriptionModel.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, total: { $sum: "$priceSnapshot" } } },
    ]);

    return res[0]?.total || 0;
  }

  async getExpiringSoon(days = 7) {
    const end = new Date();
    end.setDate(end.getDate() + days);

    return HospitalSubscriptionModel.countDocuments({
      status: "ACTIVE",
      endDate: { $lte: end },
    });
  }

  async getNewHospitalsThisMonth() {
    const start = new Date();
    start.setDate(1);

    return HospitalSubscriptionModel.distinct("hospitalId", {
      createdAt: { $gte: start },
    }).then((r) => r.length);
  }

  async getMonthlyRevenueGraph() {
    const res = await HospitalSubscriptionModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$priceSnapshot" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
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

    return res.map((r) => ({
      month: months[r._id - 1],
      amount: r.total,
    }));
  }
}
