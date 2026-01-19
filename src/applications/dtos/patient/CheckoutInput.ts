export interface CheckoutInput {
  doctorId: string;
  patientId: string;

  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  visitType?: "ONLINE" | "OPD";

  patientSnapshot: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };

  addressSnapshot?: {
    country: string;
    state: string;
    city: string;
    zip: string;
    street: string;
    apartment?: string;
  };

  notes?: string;
}
