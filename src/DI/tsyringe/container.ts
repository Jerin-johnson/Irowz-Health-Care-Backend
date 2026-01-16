import { container } from "tsyringe";
import { TOKENS } from "./tokens";
import { doctorRepo, hosptialRepository, mongoUserRepository } from "../repositers";
// import { redisOtpRepository } from "../auth";
import { jwtTokenService, otpService, passwordService } from "../service";
import { EmailQueueService } from "../../applications/queue/EmailQueueService";
import { LoginUseCase } from "../../applications/usecases/auth/login.useCase";
import { RegisterUserCase } from "../../applications/usecases/auth/register.useCase";
import { VerfiyOtpUseCase } from "../../applications/usecases/auth/verfiyOtpUseCase";
import { RefreshTokenUseCase } from "../../applications/usecases/auth/ReFreshJwtTokenUseCase";
import { ReSendOtpUseCase } from "../../applications/usecases/auth/ReSendOtpUseCase";
import { RedisOtpRepository } from "../../infrastructure/repositories/RedisOtp.repository";

// ===== interface bindings =====
container.register(TOKENS.IUserRepository, { useValue: mongoUserRepository });
container.register(TOKENS.IHospitalRepository, { useValue: hosptialRepository });
container.register(TOKENS.IOtpRepository, { useClass: RedisOtpRepository });
container.register(TOKENS.IDoctorRepository, {
  useValue: doctorRepo,
});

container.register(TOKENS.IPasswordService, { useValue: passwordService });
container.register(TOKENS.IOtpService, { useValue: otpService });
container.register(TOKENS.ITokenService, { useValue: jwtTokenService });

// ===== concrete classes =====
container.registerSingleton(EmailQueueService);

// ===== use cases =====
container.register(TOKENS.ILoginUseCase, { useClass: LoginUseCase });
container.register(TOKENS.IRegisterUserUseCase, { useClass: RegisterUserCase });
container.register(TOKENS.IVerifyOtpUseCase, { useClass: VerfiyOtpUseCase });
container.register(TOKENS.IRefreshTokenUseCase, { useClass: RefreshTokenUseCase });
container.register(TOKENS.IReSendOtpUseCase, { useClass: ReSendOtpUseCase });
