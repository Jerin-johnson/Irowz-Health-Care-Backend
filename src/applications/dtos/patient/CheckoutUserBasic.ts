export interface CheckoutUserSource {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutUserView {
  firstName: string;
  secondName: string;
  email: string;
  phone: string;
  doctorPrice?: number;
}

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
