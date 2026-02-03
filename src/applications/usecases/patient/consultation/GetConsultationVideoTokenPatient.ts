import dotenv from "dotenv";
// import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IConsultationRepository } from "../../../../domain/repositories/IConsultationRepository";
import { IGetConsultationVideoTokenPatientUseCase } from "../../../../domain/usecase/patient/consultation/IGetConsultationVideoTokenPatientUseCase";
// import { generateZegoToken04 } from "../../../../infrastructure/services/zegoToken.service";
dotenv.config();

export class GetConsultationVideoTokenPatientUseCase implements IGetConsultationVideoTokenPatientUseCase {
  constructor(
    private readonly _consultationRepo: IConsultationRepository
    // private readonly _IUserRepo: IUserRepository
  ) {}

  async execute(consultationId: string, userId?: string) {
    const consultation = await this._consultationRepo.findById(consultationId);

    if (!consultation) {
      throw new Error("Consultation not found");
    }

    // const patient = await this._IUserRepo.findById(consultation. as string);

    // const token = generateZegoToken04(
    //   Number(process.env.ZEGO_APP_ID),
    //   String(userId),
    //   process.env.ZEGO_SERVER_SECRET!,
    //   60 * 60 * 2,
    //   consultation.roomId
    // );

    return {
      // token,
      roomId: String(consultation.roomId),
      userId,
      userName: "PATIENT",
    };
  }
}
