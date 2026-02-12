export enum AuthErrorCode {
  USER_NOT_FOUND = "user not found",
  USER_ALREADY_EXISTS = "user already exists",
  USER_NOT_VERIFIED = "user not verfied",
  USER_BLOCKED = "user blocked",

  INVALID_CREDENTIALS = "invalid creditionals",
  INVALID_ACCESS = "Invalid access request",

  INVALID_OTP = "invalid otp",
  OTP_NOT_FOUND = "Otp not found",

  INVALID_RESET_TOKEN = "AUTH_INVALID_RESET_TOKEN",
}
