// import { IDoctorAppointmentRepository } from "../../../../../domain/repositories/IDoctorAppointmentRepository";

import { DomainEventPublisher } from "../../../../domain/events/event";
import { IConsultationRepository } from "../../../../domain/repositories/IConsultationRepository";
import { MarkAsNoShowUseCase } from "../../doctor/consultation/MarkAsNoShow.UseCase";

type ConsultationResponseAction = "ACCEPT" | "REJECT";

export class RespondConsultationUseCase {
  constructor(
    private readonly _consultationRepo: IConsultationRepository,
    // private readonly _appointmentRepo: IDoctorAppointmentRepository,
    private readonly _markAsNoShowUseCase: MarkAsNoShowUseCase,
    private readonly _eventPublisher: DomainEventPublisher
  ) {}

  async execute(consultationId: string, patientId: string, action: ConsultationResponseAction) {
    const consultation = await this._consultationRepo.findById(consultationId);

    if (!consultation) {
      throw new Error("Consultation not found");
    }

    if (String(consultation.patientId) !== patientId) {
      throw new Error("You are not authorized to respond to this consultation");
    }

    if (consultation.status === "ENDED") {
      throw new Error("Consultation already ended");
    }

    if (consultation.status === "REJECTED") {
      return { message: "Consultation already rejected" };
    }

    if (consultation.status === "IN_PROGRESS") {
      return { message: "Consultation already accepted" };
    }

    if (action === "ACCEPT") {
      const updatedConsultation = await this._consultationRepo.markStarted(consultationId);

      if (!updatedConsultation) {
        throw new Error("Failed to start consultation");
      }

      await this._eventPublisher.publish({
        type: "ONLINE_CONSULTATION_ACCEPTED",
        payload: {
          consultationId,
          appointmentId: String(consultation.appointmentId),
          doctorId: String(consultation.doctorId),
          patientId,
        },
      });

      return {
        message: "Consultation accepted",
        status: "IN_PROGRESS",
      };
    }

    // REJECT FLOW
    if (action === "REJECT") {
      // Mark consultation rejected
      await this._consultationRepo.update(consultationId, {
        status: "REJECTED",
      });

      await this._markAsNoShowUseCase.execute(
        String(consultation.appointmentId),
        String(consultation.doctorId)
      );

      await this._eventPublisher.publish({
        type: "ONLINE_CONSULTATION_REJECTED",
        payload: {
          consultationId,
          appointmentId: String(consultation.appointmentId),
          doctorId: String(consultation.doctorId),
          patientId,
        },
      });

      return {
        message: "Consultation rejected and marked as no-show",
        status: "REJECTED",
      };
    }

    throw new Error("Invalid consultation response action");
  }
}
