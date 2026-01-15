export const HOSPITAL_ADMIN_ROUTES = {
  // Verification
  VERIFICATION: "/verification",
  VERIFICATION_REAPPLY: "/verification/reapply/:id",
  VERIFICATION_STATUS: "/verification/status/:id",

  // Speciality management
  SPECIALITY: "/speciality",
  SPECIALITY_NAMES: "/speciality/names",
  SPECIALITY_BY_ID: "/speciality/:id",
  SPECIALITY_TOGGLE_STATUS: "/speciality/toggle/status",

  // Doctor management
  DOCTOR: "/doctor",
  DOCTOR_TOGGLE_STATUS: "/doctor/toggle/status",
} as const;
