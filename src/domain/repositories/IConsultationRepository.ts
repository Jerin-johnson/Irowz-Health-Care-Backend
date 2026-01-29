import { ConsultationOnlineDocument } from "../../infrastructure/database/mongo/models/ConsultationOnline";
import { IBaseRepository } from "./base/IBaseRepository";

export interface IConsultationRepository extends IBaseRepository<
  Partial<ConsultationOnlineDocument>,
  Partial<ConsultationOnlineDocument>,
  ConsultationOnlineDocument
> {
  findByAppointmentId(appointmentId: string): Promise<ConsultationOnlineDocument | null>;

  findActiveByDoctorId(doctorId: string): Promise<ConsultationOnlineDocument | null>;

  updateStatus(
    consultationId: string,
    status: ConsultationOnlineDocument["status"]
  ): Promise<ConsultationOnlineDocument | null>;

  markStarted(consultationId: string): Promise<ConsultationOnlineDocument | null>;

  markEnded(consultationId: string): Promise<ConsultationOnlineDocument | null>;

  save(consultation: ConsultationOnlineDocument): Promise<void>;
}
