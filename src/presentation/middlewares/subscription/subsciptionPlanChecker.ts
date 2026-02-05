import { NextFunction, Request, Response } from "express";
import { HospitalSubscriptionRepository } from "../../../infrastructure/repositories/HospitalSubscriptionRepository";
import { DoctorModel } from "../../../infrastructure/database/mongo/models/Doctor.model";
import { HttpStatusCode } from "axios";
const hospitalSubRepo = new HospitalSubscriptionRepository();

export const subscriptionPlanChecker = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  const sub = await hospitalSubRepo.findActiveByHospital(user.hospitalId);

  if (!sub || sub.endDate < new Date()) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json({ message: "Subscription expired. Upgrade required." });
  }

  const count = await DoctorModel.countDocuments({ hospitalId: user.hospitalId });

  if (count >= sub.doctorLimitSnapshot) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json({ message: "Doctor limit reached. Upgrade plan." });
  }

  next();
};
