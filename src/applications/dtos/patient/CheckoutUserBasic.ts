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
