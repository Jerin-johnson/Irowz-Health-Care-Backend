import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IBlockOrUnblockDoctorUseCase } from "../../../../domain/usecase/hosptialAdmin/doctorMangement/IBlockOrUnblockDoctorUseCase.usecase";

export class BlockOrUnblockDoctorUseCase implements IBlockOrUnblockDoctorUseCase {
  constructor(
    private readonly DoctorRepository: IDoctorRepository,
    private readonly UserRepo: IUserRepository
  ) {}

  async execute(data: { doctorId: string; status: string }) {
    const finalStatus = data.status == "true" ? true : false;

    console.log("final status", finalStatus);

    const result = await this.DoctorRepository.toggleStatus(
      data.doctorId,
      finalStatus
    );

    console.log(result);

    if (!result)
      throw new Error("cannot able to change the status of the doctor");

    const user = await this.UserRepo.BlockByUserId(result.userId, !finalStatus);

    console.log("user is ", user);

    return { message: "Blocked the doctor successfully" };
  }
}
