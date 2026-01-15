export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  RESEND_OTP: "/resend-otp",
  REFRESH_TOKEN: "/refresh-token",
  LOGOUT: "/logout",

  DOCTOR_LOGIN: "/doctor/login",
  HOSPITAL_ADMIN_LOGIN: "/hospital-admin/login",
  SUPER_ADMIN_LOGIN: "/super-admin/login",
} as const;
