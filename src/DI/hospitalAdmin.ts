import { SubmitHositalVerficationRequest } from "../applications/usecases/hosptialOnBorading/SubmitHospitalVerification.usecase";
import { HospitalOnBoradingController } from "../presentation/controllers/hospital_onBoarding/HospitalOnboardingController";
import {
  mongoUserRepository,
  hosptialVerficatinRepo,
  hospitalSpecialityRepo,
} from "./repositers";
import { passwordService, pdfUPloadQueueService } from "./service";
import { ResubmitHospitalVerificationUseCase } from "../applications/usecases/hosptialOnBorading/ReSumbitHospitalVerification.useCase";
import { HospitalAdminRoutes } from "../presentation/routes/hospital_admin.routes";
import { CheckHospitalVerfcationStatusById } from "../applications/usecases/hosptialOnBorading/checkStatusById";
import { AddHospitalSpecialtyUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/AddSpeciality.useCase";
import { SpecialtyMangmentController } from "../presentation/controllers/hospitalAdmin/SpecialityMangment.Controller";
import { GetAllSpecialtyUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/GetAllSpecialitySearch.usecase";
import { BlockOrUnblockSpecialtyUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/BlockOrUnblockSpeciality.useCase";
import { EditSpecialityUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/EditSpecialty.useCase";

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

const addHospitalSpecialtyUseCase = new AddHospitalSpecialtyUseCase(
  hospitalSpecialityRepo
);

const getAllSpecialtyUseCase = new GetAllSpecialtyUseCase(
  hospitalSpecialityRepo
);

const blockOrUnblockSpecialtyUseCase = new BlockOrUnblockSpecialtyUseCase(
  hospitalSpecialityRepo
);

const editSpecialityUseCase = new EditSpecialityUseCase(hospitalSpecialityRepo);
const specialityMangementController = new SpecialtyMangmentController(
  addHospitalSpecialtyUseCase,
  getAllSpecialtyUseCase,
  blockOrUnblockSpecialtyUseCase,
  editSpecialityUseCase
);

export const hospitalAdminRoutes = new HospitalAdminRoutes(
  hospitalOnBoradingController,
  specialityMangementController
);
