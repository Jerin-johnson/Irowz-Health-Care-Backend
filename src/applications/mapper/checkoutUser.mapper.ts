import { CheckoutUserSource, CheckoutUserView } from "../dtos/patient/CheckoutUserBasic";

export class userMapperForCheckout {
  static toView(dto: CheckoutUserSource): CheckoutUserView {
    console.log(dto);
    return {
      firstName: dto.name.split(" ")[0],
      secondName: dto.name.split(" ")[1],
      email: dto.email,
      phone: dto.phone,
    };
  }
}
