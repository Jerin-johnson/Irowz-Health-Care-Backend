import { NextFunction, Request, Response } from "express";
import { HospitalSubscriptionRepository } from "../../../infrastructure/repositories/HospitalSubscriptionRepository";
import { DoctorModel } from "../../../infrastructure/database/mongo/models/Doctor.model";
import { HttpStatusCode } from "axios";

const hospitalSubRepo = new HospitalSubscriptionRepository();

export const subscriptionPlanChecker = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as {
    userId: string;
    role: "PATIENT" | "DOCTOR" | "HOSPITAL_ADMIN" | "SUPER_ADMIN";
    hospitalId?: string;
    doctorId?: string;
    patientId?: string;
    forcePasswordReset?: string;
  };

  const sub = await hospitalSubRepo.findActiveByHospital(user?.userId);

  console.log("The subscription ", sub);

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
