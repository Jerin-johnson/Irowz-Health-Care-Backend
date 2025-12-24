import { LoginUseCase } from "../applications/usecases/auth/login.useCase";
import { RegisterUserCase } from "../applications/usecases/auth/register.useCase";
import { AuthController } from "../presentation/controllers/auth/Auth.controller";
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
import { mongoUserRepository } from "./repositers";

const redisOtpRepository = new RedisOtpRepository();

// queque service

const emailQuequeService = new EmailQueueService();
const loginUseCase = new LoginUseCase(
  mongoUserRepository,
  passwordService,
  jwtTokenService
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
const authController = new AuthController(
  loginUseCase,
  registerUseCase,
  verfiyOtpUseCase
);

export const authRoute = new AuthRoute(authController);
