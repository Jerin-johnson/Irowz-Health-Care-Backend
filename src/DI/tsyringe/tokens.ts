export const TOKENS = {
  IUserRepository: "IUserRepository",
  IDoctorRepository: "IDoctorRepository",
  IHospitalRepository: "IHospitalRepository",
  IPasswordService: "IPasswordService",
  ITokenService: "ITokenService",
  IOtpService: "IOtpService",
  IOtpRepository: "IOtpRepository",
  IPatientProfileRepository: "IPatientProfileRepository",

  // use cases
  ILoginUseCase: "ILoginUseCase",
  IRegisterUserUseCase: "IRegisterUserUseCase",
  IVerifyOtpUseCase: "IVerifyOtpUseCase",
  IRefreshTokenUseCase: "IRefreshTokenUseCase",
  IReSendOtpUseCase: "IReSendOtpUseCase",
  IForgetPasswordUseCase: "IForgetPasswordUseCase",
  IResetPasswordUseCase: "IResetPasswordUseCase",
};
