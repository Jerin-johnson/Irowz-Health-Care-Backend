export enum AuthEvent {
  OTP_SENT = "OTP_SENT",
  PASSWORD_RESET_LINK_SENT = "If the email exists, a reset link has been sent",
  PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS",
  VERIFIED = "VERIFIED",
}

export const AUTH_CONFIG = {
  OTP_EXPIRY_SECONDS: 70,
  RESET_TOKEN_EXPIRY_MS: 10 * 60 * 1000,
};
