export const SUPER_ADMIN_ROUTES = {
  // Hospital verification
  HOSPITAL_VERIFICATION_STATS: "/hospital-verifications/stats",
  HOSPITAL_VERIFICATIONS: "/hospital-verifications",
  HOSPITAL_VERIFICATION_BY_ID: "/hospital-verifications/:id",
  HOSPITAL_LICENSE_VIEW: "/hospital-verifications/:id/license/view",
  HOSPITAL_APPROVE: "/hospital-verifications/:hospitalId/approve",
  HOSPITAL_REJECT: "/hospital-verifications/:hospitalId/reject",

  // Hospital management
  HOSPITAL: "/hospital",
  HOSPITAL_TOGGLE_STATUS: "/hospital/toggle/status",
} as const;
