import { IConsultationRepository } from "../../domain/repositories/IConsultationRepository";
import {
  ConsultationModel,
  ConsultationOnlineDocument,
} from "../database/mongo/models/ConsultationOnline";
import { BaseRepository } from "./base/Base.repository";

export class ConsultationRepository
  extends BaseRepository<
    Partial<ConsultationOnlineDocument>,
    Partial<ConsultationOnlineDocument>,
    ConsultationOnlineDocument
  >
  implements IConsultationRepository
{
  constructor() {
    super(ConsultationModel);
  }

  async findByAppointmentId(appointmentId: string): Promise<ConsultationOnlineDocument | null> {
    return ConsultationModel.findOne({ appointmentId });
  }

  async findActiveByDoctorId(doctorId: string): Promise<ConsultationOnlineDocument | null> {
    return ConsultationModel.findOne({
      doctorId,
      status: { $in: ["CALLING", "RINGING", "IN_PROGRESS"] },
    });
  }

  async updateStatus(
    consultationId: string,
    status: ConsultationOnlineDocument["status"]
  ): Promise<ConsultationOnlineDocument | null> {
    return ConsultationModel.findByIdAndUpdate(consultationId, { status }, { new: true });
  }

  async markStarted(consultationId: string): Promise<ConsultationOnlineDocument | null> {
    return ConsultationModel.findByIdAndUpdate(
      consultationId,
      {
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
      { new: true }
    );
  }

  async markEnded(consultationId: string): Promise<ConsultationOnlineDocument | null> {
    return ConsultationModel.findByIdAndUpdate(
      consultationId,
      {
        status: "ENDED",
        endedAt: new Date(),
      },
      { new: true }
    );
  }

  async save(consultation: ConsultationOnlineDocument): Promise<void> {
    await consultation.save();
  }
}
