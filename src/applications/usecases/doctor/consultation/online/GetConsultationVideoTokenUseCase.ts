import { IConsultationRepository } from "../../../../../domain/repositories/IConsultationRepository";
import { IUserRepository } from "../../../../../domain/repositories/IUser.repo";
// import { generateZegoToken04 } from "../../../../../infrastructure/services/zegoToken.service";
import dotenv from "dotenv";
dotenv.config();

export class GetConsultationVideoTokenDoctorUseCase {
  constructor(
    private readonly _consultationRepo: IConsultationRepository,
    private readonly _IUserRepo: IUserRepository
  ) {}

  async execute(consultationId: string, doctorId?: string) {
    const consultation = await this._consultationRepo.findById(consultationId);

    if (!consultation) {
      throw new Error("Consultation not found");
    }

    // const patient = await this._IUserRepo.findById(consultation.patientId as string);

    // const token = generateZegoToken04(
    //   Number(process.env.ZEGO_APP_ID),
    //   String(doctorId),
    //   process.env.ZEGO_SERVER_SECRET!,
    //   60 * 60 * 2,
    //   consultation.roomId
    // );

    return {
      // token,
      roomId: consultation.roomId,
      userId: doctorId,
      userName: "DOCTOR",
    };
  }
}
