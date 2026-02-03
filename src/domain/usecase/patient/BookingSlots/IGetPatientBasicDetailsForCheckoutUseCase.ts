import { CheckoutUserView } from "../../../../applications/dtos/patient/CheckoutUserBasic";

export interface IGetPatientBasicDetailsForCheckoutUseCase {
  execute(userId: string, doctorId: string): Promise<CheckoutUserView>;
}
