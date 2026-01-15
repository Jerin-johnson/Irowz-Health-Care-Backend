export const PATIENT_ROUTES = {
  // Doctor slots
  DOCTOR_SLOT: "/doctor/slot",
  DOCTOR_SLOT_LOCK: "/doctor/slot/lock",
  DOCTOR_SLOT_UNLOCK: "/doctor/slot/unlock",

  // Doctor listing
  DOCTOR_SPECIALITY: "/doctor/speciality",
  DOCTORS: "/doctors",
  DOCTOR_PROFILE: "/doctor/:id",

  // Checkout & payment
  CHECKOUT_PROFILE: "/checkout/profile",
  CHECKOUT: "/checkout",
  PAYMENT_VERIFY: "/payment/verify",

  // Appointment
  APPOINTMENT_SUCCESS: "/appointment/success/:id",

  // Reviews
  DOCTOR_REVIEW_BY_ID: "/doctor/review/:id",
  DOCTOR_REVIEW: "/doctor/review",
} as const;
