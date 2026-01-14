import cron from "node-cron";
import { DoctorAppointmentModel } from "../infrastructure/database/mongo/models/DoctorAppointmentModel";

const PAYMENT_TIMEOUT_MINUTES = 10;

export const startPaymentExpiryCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("🔄 Running payment expiry cron...");

      const expiryTime = new Date(Date.now() - PAYMENT_TIMEOUT_MINUTES * 60 * 1000);

      const expiredAppointments = await DoctorAppointmentModel.find({
        paymentStatus: "PENDING",
        status: "PENDING",
        createdAt: { $lte: expiryTime },
      });

      console.log("expired apponiment", expiredAppointments);

      if (expiredAppointments.length === 0) return;

      for (const appointment of expiredAppointments) {
        appointment.status = "CANCELLED";
        appointment.paymentStatus = "EXPIRED";
        appointment.updatedAt = new Date();
        appointment.cancelReason = "PAYMENT_TIMEOUT";
        appointment.cancelledAt = new Date();

        await appointment.save();
      }
    } catch (error) {
      console.error("Cron error:", error);
    }
  });
};
