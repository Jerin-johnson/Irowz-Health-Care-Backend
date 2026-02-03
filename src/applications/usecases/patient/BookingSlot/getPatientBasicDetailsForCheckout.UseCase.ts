import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { userMapperForCheckout } from "../../../dtos/patient/CheckoutUserBasic";

export class GetPatientBasicDetailsForCheckoutUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _DoctorRepo: IDoctorRepository
  ) {}

  async execute(userId: string, doctorId: string) {
    const result = await this._userRepo.findById(userId);

    if (!result) throw new Error("Cannot fectch patient details something went wrong");

    const mappedResultUser = userMapperForCheckout.toView(result);
    const doctor = await this._DoctorRepo.findById(doctorId);
    mappedResultUser.doctorPrice = doctor?.consultationFee;
    return mappedResultUser;
  }
}
