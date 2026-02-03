export enum PatientMessages {
  PROFILE_FETCHED = "Profile fetched successfully",

  APPOINTMENTS_FETCHED = "Patient appointments fetched successfully",
  LIVE_QUEUE_STATUS = "Live queue status",

  //Booking message
  SLOT_TAKEN = "This slot was just taken by another patient",
  SLOT_LOCKED = "Slot locked successfully",
  SLOT_UNLOCKED = "Slot unlocked successfully",

  APPOINTMENT_CREATED = "Appointment created successfully",
  PAYMENT_VERIFIED = "Payment verified successfully",

  //Doctor review
  REVIEW_POSTED = "Review posted successfully",
}
