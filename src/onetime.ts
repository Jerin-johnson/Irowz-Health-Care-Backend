import { HospitalModel } from "./infrastructure/database/mongo/models/Hospital.model";
import { HospitalSubscriptionRepository } from "./infrastructure/repositories/HospitalSubscriptionRepository";
import { SubscriptionPlanRepository } from "./infrastructure/repositories/SubscriptionPlanRepository";

const planRepo = new SubscriptionPlanRepository();
const hospitalSubRepo = new HospitalSubscriptionRepository();

export async function oneTime() {
  const freeTrial = await planRepo.findByName("free trial");

  const hospitals = await HospitalModel.find();

  if (!freeTrial) {
    throw new Error("please implement free trial");
  }

  for (const hospital of hospitals) {
    const active = await hospitalSubRepo.findActiveByHospital(String(hospital.userId));

    if (!active) {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + freeTrial.durationInDays);

      await hospitalSubRepo.create({
        hospitalId: hospital.userId,
        planId: freeTrial._id,
        doctorLimitSnapshot: freeTrial.doctorLimit,
        priceSnapshot: freeTrial.price,
        durationSnapshot: freeTrial.durationInDays,
        startDate: start,
        endDate: end,
        status: "ACTIVE",
      });
    }
  }
}
