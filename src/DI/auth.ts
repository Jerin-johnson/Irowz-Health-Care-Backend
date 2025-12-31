import { LoginUseCase } from "../applications/usecases/auth/login.useCase";
import { RegisterUserCase } from "../applications/usecases/auth/register.useCase";
import { AuthController } from "../presentation/controllers/auth/Auth.controller";
import { RefreshTokenUseCase } from "../applications/usecases/auth/ReFreshJwtTokenUseCase";
import { AuthRoute } from "../presentation/routes/auth.routes";
import {
  jwtTokenService,
  passwordService,
  otpService,
  emailNotificationService,
} from "./service";
import { RedisOtpRepository } from "../infrastructure/repositories/RedisOtp.repository";
import { EmailQueueService } from "../applications/queue/EmailQueueService";
import { VerfiyOtpUseCase } from "../applications/usecases/auth/verfiyOtpUseCase";
import {
  doctorRepo,
  hosptialRepository,
  mongoUserRepository,
} from "./repositers";
import { ReSendOtpUseCase } from "../applications/usecases/auth/ReSendOtpUseCase";

const redisOtpRepository = new RedisOtpRepository();

// queque service

export const emailQuequeService = new EmailQueueService();
const loginUseCase = new LoginUseCase(
  mongoUserRepository,
  passwordService,
  jwtTokenService,
  hosptialRepository,
  doctorRepo
);

const registerUseCase = new RegisterUserCase(
  mongoUserRepository,
  passwordService,
  otpService,
  emailQuequeService,
  redisOtpRepository
);

const verfiyOtpUseCase = new VerfiyOtpUseCase(
  mongoUserRepository,
  redisOtpRepository,
  otpService,
  jwtTokenService
);

const resendOtpUseCase = new ReSendOtpUseCase(
  otpService,
  emailQuequeService,
  redisOtpRepository
);

const refreshTokenUseCase = new RefreshTokenUseCase(jwtTokenService);
const authController = new AuthController(
  loginUseCase,
  registerUseCase,
  verfiyOtpUseCase,
  refreshTokenUseCase,
  resendOtpUseCase
);

export const authRoute = new AuthRoute(authController);
