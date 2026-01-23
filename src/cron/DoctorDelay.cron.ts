import cron from "node-cron";
import { doctorAvailabilityRepository } from "../DI/repositers";

export function startDoctorDelayResetCron() {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("[CRON] Resetting doctor delay for new day...");
      await doctorAvailabilityRepository.resetDailyDelay();
      console.log("[CRON] Doctor delay reset completed");
    } catch (error) {
      console.error("[CRON] Failed to reset doctor delay", error);
    }
  });
}
