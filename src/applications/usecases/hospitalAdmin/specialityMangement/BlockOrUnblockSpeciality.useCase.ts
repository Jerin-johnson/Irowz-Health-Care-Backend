import { IHospitalSpecialtyRepository } from "../../../../domain/repositories/IHospitalSpecaility.repo";
import { IBlockOrUnblockSpecialtyUseCase } from "../../../../domain/usecase/hosptialAdmin/specialityMangement/IBlockOrUnblockSpecialtyUseCase.usecase";

export class BlockOrUnblockSpecialtyUseCase implements IBlockOrUnblockSpecialtyUseCase {
  constructor(private readonly specialtyRepository: IHospitalSpecialtyRepository) {}

  async execute(data: { id: string; status: string }) {
    const finalStatus = data.status == "true" ? true : false;

    await this.specialtyRepository.blockOrUnblock(data.id, {
      isActive: finalStatus,
    });

    return { message: "Blocked the hospital successfully" };
  }
}
