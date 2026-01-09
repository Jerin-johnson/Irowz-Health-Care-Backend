import { Request, Response } from "express";
import { UpsertDoctorAvailabilityUseCase } from "../../../applications/usecases/doctor/doctorAvailability/DoctorAvailabilityController";

export class DoctorAvailabilityController {
  constructor(private readonly _upsertAvailability: UpsertDoctorAvailabilityUseCase) {}

  upsert = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId as string;

    const availability = await this._upsertAvailability.execute(doctorId, req.body);

    res.status(200).json({
      success: true,
      data: availability,
    });
  };

  get = async (req: Request, res: Response) => {
    const doctorId = req.user?.doctorId;

    const availability = await this._upsertAvailability["_availabilityRepo"].findByDoctorId(
      doctorId as string
    );

    res.json({
      success: true,
      data: availability,
    });
  };
}
