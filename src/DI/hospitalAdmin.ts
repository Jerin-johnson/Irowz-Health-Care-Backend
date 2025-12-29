import { SubmitHositalVerficationRequest } from "../applications/usecases/hosptialOnBorading/SubmitHospitalVerification.usecase";
import { HospitalOnBoradingController } from "../presentation/controllers/hospital_onBoarding/HospitalOnboardingController";
import { mongoUserRepository, hosptialVerficatinRepo } from "./repositers";
import { passwordService, pdfUPloadQueueService } from "./service";
import { ResubmitHospitalVerificationUseCase } from "../applications/usecases/hosptialOnBorading/ReSumbitHospitalVerification.useCase";
import { HospitalAdminRoutes } from "../presentation/routes/hospital_admin.routes";
import { CheckHospitalVerfcationStatusById } from "../applications/usecases/hosptialOnBorading/checkStatusById";

const submitHositalVerficationRequest = new SubmitHositalVerficationRequest(
  mongoUserRepository,
  hosptialVerficatinRepo,
  passwordService,
  pdfUPloadQueueService
);
const resubmitHospitalVerificationUseCase =
  new ResubmitHospitalVerificationUseCase(
    mongoUserRepository,
    hosptialVerficatinRepo
  );

const checkHospitalVerfcationStatusById = new CheckHospitalVerfcationStatusById(
  hosptialVerficatinRepo
);
const hospitalOnBoradingController = new HospitalOnBoradingController(
  submitHositalVerficationRequest,
  resubmitHospitalVerificationUseCase,
  checkHospitalVerfcationStatusById
);

export const hospitalAdminRoutes = new HospitalAdminRoutes(
  hospitalOnBoradingController
);
