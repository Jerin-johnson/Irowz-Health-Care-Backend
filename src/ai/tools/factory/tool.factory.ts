import { GetDoctorAvailabileSlotUseCase } from "../../../applications/usecases/patient/AvailableSlot/GetDoctorAvailableSlot.UseCase";
import { CheckoutUseCase } from "../../../applications/usecases/patient/BookingSlot/CheckoutUseCase";
import { LockDoctorSlotUseCase } from "../../../applications/usecases/patient/BookingSlot/LockDoctorSlotUseCase";
import { UnLockDoctorSlotUseCase } from "../../../applications/usecases/patient/BookingSlot/UnLockDoctorSlot.useCase";
import { DoctorSearchUseCase } from "../../../applications/usecases/patient/DoctorListing/DoctorSearch.UseCase";
import { GetAvailableSpecialityUseCase } from "../../../applications/usecases/patient/DoctorListing/GetAvailbaleSpecialty.useCase";
import { GetProfileUseCase } from "../../../applications/usecases/patient/ProfileAndSetting/GetProfile.UseCase";
import {
  checkoutUseCase,
  doctorSearchUseCase,
  getAvailableSpecialityUseCase,
  getDoctorAvailabileSlotUseCase,
  getProfileUseCase,
  lockDoctorSlotUseCase,
  unLockDoctorSlotUseCase,
} from "../../../DI/patient";
import { BookWithWalletTool } from "../book-with-wallet.tool";
import { GeocodeCityTool } from "../geocode-city.tool";
import { GetProfileTool } from "../get-profile.tool";
import { GetAvailableSlotsTool } from "../get-slots.tool";
import { WalletTool } from "../get-wallet-balance.tool";
import { LockSlotTool } from "../lock-slot.tool";
import { SearchDoctorsTool } from "../search-doctor.tool";
import { SearchSpecialtiesTool } from "../SearchSpecialtiesTool";
import { UnlockSlotTool } from "../unlock-slot.tool";

export class ToolFactory {
  private getProfileUseCase: GetProfileUseCase;
  private getAvailableSpecialityUseCase: GetAvailableSpecialityUseCase;
  private doctorSearchUseCase: DoctorSearchUseCase;
  private getDoctorAvailabileSlotUseCase: GetDoctorAvailabileSlotUseCase;
  private lockDoctorSlotUseCase: LockDoctorSlotUseCase;
  private unLockDoctorSlotUseCase: UnLockDoctorSlotUseCase;
  private checkoutUseCase: CheckoutUseCase;

  constructor() {
    this.getProfileUseCase = getProfileUseCase;
    this.getAvailableSpecialityUseCase = getAvailableSpecialityUseCase;
    this.doctorSearchUseCase = doctorSearchUseCase;
    this.getDoctorAvailabileSlotUseCase = getDoctorAvailabileSlotUseCase;
    this.lockDoctorSlotUseCase = lockDoctorSlotUseCase;
    this.unLockDoctorSlotUseCase = unLockDoctorSlotUseCase;
    this.checkoutUseCase = checkoutUseCase;
  }

  build(userId: string) {
    console.log("Building tools for user:", userId);
    const startTime = Date.now();
    console.log("Building tools...");

    const tools = [
      new GetProfileTool(this.getProfileUseCase).build(userId),
      new SearchSpecialtiesTool(this.getAvailableSpecialityUseCase).build(),
      new SearchDoctorsTool(this.doctorSearchUseCase).build(),
      new GetAvailableSlotsTool(this.getDoctorAvailabileSlotUseCase).build(),
      new LockSlotTool(this.lockDoctorSlotUseCase).build(userId),
      new GeocodeCityTool().build(),
      new WalletTool().build(userId),
      new UnlockSlotTool(this.unLockDoctorSlotUseCase).build(),
      new BookWithWalletTool(this.checkoutUseCase).build(userId),
    ];

    console.log(`Tools built in ${Date.now() - startTime}ms`);

    return tools;
  }
}
