export class userMapperForCheckout {
  static toView(dto: any): {
    firstName: string;
    secondName: string;
    email: string;
    phone: string;
    doctorPrice?: number | string;
  } {
    console.log(dto);
    return {
      firstName: dto.name.split(" ")[0],
      secondName: dto.name.split(" ")[1],
      email: dto.email,
      phone: dto.phone,
    };
  }
}
