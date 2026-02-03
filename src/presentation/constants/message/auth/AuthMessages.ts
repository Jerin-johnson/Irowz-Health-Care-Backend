export enum AuthMessages {
  // General
  UNAUTHORIZED = "Unauthorized",
  INVALID_REQUEST = "Invalid request",
  FIELDS_MISSING = "Fields are missing",

  // Auth flow
  LOGOUT_SUCCESS = "User logout successfully",
  OTP_RESENT = "OTP resent successfully",

  // Password
  FORGET_PASSWORD_EMAIL_SENT = "Password reset email sent successfully",
}

export enum AuthConstants {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",

  AUTH_HEADER = "Authorization",
  BEARER_PREFIX = "Bearer",
}
