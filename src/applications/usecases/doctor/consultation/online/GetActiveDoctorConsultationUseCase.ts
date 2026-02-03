import { IConsultationRepository } from "../../../../../domain/repositories/IConsultationRepository";

export class GetActiveDoctorOnlineConsultationUseCase implements GetActiveDoctorOnlineConsultationUseCase {
  constructor(private readonly _consultationRepo: IConsultationRepository) {}

  async execute(doctorId: string) {
    if (!doctorId) {
      throw new Error("doctorId is required");
    }

    const consultation = await this._consultationRepo.findActiveByDoctorId(doctorId);

    if (!consultation) {
      return {
        status: "IDLE",
      };
    }

    return {
      status: consultation.status, // CALLING | IN_PROGRESS
      consultationId: consultation._id,
      appointmentId: consultation.appointmentId,
      patientId: consultation.patientId,
      roomId: consultation.roomId,
    };
  }
}
