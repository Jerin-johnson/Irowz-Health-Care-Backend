import { IConsultationRepository } from "../../../../../domain/repositories/IConsultationRepository";
import { IEndConsultationOnlineUseCase } from "../../../../../domain/usecase/doctor/consultation/online/IEndConsultationOnlineUseCase";

export class EndConsultationOnlineUseCase implements IEndConsultationOnlineUseCase {
  constructor(private readonly _consultationRepo: IConsultationRepository) {}

  async execute(consultationId: string) {
    console.log("The id is", consultationId);
    const consultation = await this._consultationRepo.findById(consultationId);

    console.log(consultation);

    if (!consultation) {
      throw new Error("Consultation not found");
    }

    if (consultation.status === "ENDED") {
      return;
    }

    consultation.status = "ENDED";
    consultation.endedAt = new Date();

    await this._consultationRepo.save(consultation);
  }
}
