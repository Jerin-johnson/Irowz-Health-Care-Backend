import { SubmitHositalVerficationRequest } from "../applications/usecases/hosptialOnBorading/SubmitHospitalVerification.usecase";
import { HospitalOnBoradingController } from "../presentation/controllers/hospital_onBoarding/HospitalOnboardingController";
import {
  mongoUserRepository,
  hosptialVerficatinRepo,
  hospitalSpecialityRepo,
  doctorRepo,
  hosptialRepository,
  subscriptionPlanRepository,
  hospitalSubscriptionRepository,
  walletRepo,
  hospitalDashboardRepository,
  hospitalLabOrderRepository,
  medicalRecordRepository,
} from "./repositers";
import { emailQueueService, passwordService, razorpayGateway, s3FileStorage } from "./service";
import { ResubmitHospitalVerificationUseCase } from "../applications/usecases/hosptialOnBorading/ReSumbitHospitalVerification.useCase";
import { HospitalAdminRoutes } from "../presentation/routes/hospital_admin.routes";
import { CheckHospitalVerfcationStatusById } from "../applications/usecases/hosptialOnBorading/checkStatusById";
import { AddHospitalSpecialtyUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/AddSpeciality.useCase";
import { SpecialtyMangmentController } from "../presentation/controllers/hospitalAdmin/SpecialityMangment.Controller";
import { GetAllSpecialtyUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/GetAllSpecialitySearch.usecase";
import { BlockOrUnblockSpecialtyUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/BlockOrUnblockSpeciality.useCase";
import { EditSpecialityUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/EditSpecialty.useCase";
import { AdminCreateDoctorUseCase } from "../applications/usecases/hospitalAdmin/doctorMangement/AdminCreateDoctorUseCase";
import { DoctorMangmentController } from "../presentation/controllers/hospitalAdmin/DoctorMangment.Controller";
// import { emailQuequeService } from "./auth";
import { GetAllDoctorUseCase } from "../applications/usecases/hospitalAdmin/doctorMangement/GetDoctor.useCase";
import { GetAllSpecialtyNameUseCase } from "../applications/usecases/hospitalAdmin/specialityMangement/GetAllSpecialityName.userCae";
import { BlockOrUnblockDoctorUseCase } from "../applications/usecases/hospitalAdmin/doctorMangement/BlockOrUnBlockDoctor.UseCase";
import { HospitalADminSubscriptionController } from "../presentation/controllers/hospitalAdmin/SubscriptionController";
import { GetActivePlansForListingHospitalAdminUseCase } from "../applications/usecases/hospitalAdmin/subscription/GetSubscriptionPlans";
import { CreateSubscriptionOrderUseCase } from "../applications/usecases/hospitalAdmin/subscription/CreateSubscriptionOrderUseCase";
import { BuySubscriptionUseCase } from "../applications/usecases/hospitalAdmin/subscription/BuySubscriptionUseCase";
import { HospitalDashboardController } from "../presentation/controllers/hospitalAdmin/HospitalDashboardController";
import { GetHospitalDashboardOverviewUseCase } from "../applications/usecases/hospitalAdmin/dashboard/HosptialAdminDashboardUseCase";
import { ListHospitalLabOrdersUseCase } from "../applications/usecases/hospitalAdmin/LabOrder/ListHospitalLabOrdersUseCase";
import { UploadHospitalLabTestUseCase } from "../applications/usecases/hospitalAdmin/LabOrder/UploadHospitalLabTestUseCase";
import { HospitalLabAdminController } from "../presentation/controllers/hospitalAdmin/LabOrderMangment.Controller";

const submitHositalVerficationRequest = new SubmitHositalVerficationRequest(
  mongoUserRepository,
  hosptialVerficatinRepo,
  passwordService,
  s3FileStorage
);
const resubmitHospitalVerificationUseCase = new ResubmitHospitalVerificationUseCase(
  mongoUserRepository,
  hosptialVerficatinRepo,
  s3FileStorage
);

const checkHospitalVerfcationStatusById = new CheckHospitalVerfcationStatusById(
  hosptialVerficatinRepo
);
const hospitalOnBoradingController = new HospitalOnBoradingController(
  submitHositalVerficationRequest,
  resubmitHospitalVerificationUseCase,
  checkHospitalVerfcationStatusById
);

const addHospitalSpecialtyUseCase = new AddHospitalSpecialtyUseCase(hospitalSpecialityRepo);

const getAllSpecialtyUseCase = new GetAllSpecialtyUseCase(hospitalSpecialityRepo);

const blockOrUnblockSpecialtyUseCase = new BlockOrUnblockSpecialtyUseCase(hospitalSpecialityRepo);

const editSpecialityUseCase = new EditSpecialityUseCase(hospitalSpecialityRepo);

const getAllSpecialtyNameUseCase = new GetAllSpecialtyNameUseCase(hospitalSpecialityRepo);

const specialityMangementController = new SpecialtyMangmentController(
  addHospitalSpecialtyUseCase,
  getAllSpecialtyUseCase,
  blockOrUnblockSpecialtyUseCase,
  editSpecialityUseCase,
  getAllSpecialtyNameUseCase
);

const adminCreateDoctorUseCase = new AdminCreateDoctorUseCase(
  mongoUserRepository,
  doctorRepo,
  emailQueueService,
  hospitalSpecialityRepo,
  passwordService,
  hosptialRepository
);

const getAllDoctorUseCase = new GetAllDoctorUseCase(doctorRepo);

const blockOrUnblockDoctorUseCase = new BlockOrUnblockDoctorUseCase(
  doctorRepo,
  mongoUserRepository
);

const doctorMangmentController = new DoctorMangmentController(
  adminCreateDoctorUseCase,
  getAllDoctorUseCase,
  blockOrUnblockDoctorUseCase
);

const getActivePlansForListingHospitalAdminUseCase =
  new GetActivePlansForListingHospitalAdminUseCase(
    subscriptionPlanRepository,
    hospitalSubscriptionRepository
  );

const createSubscriptionOrderUseCase = new CreateSubscriptionOrderUseCase(
  razorpayGateway,
  subscriptionPlanRepository
);

const buySubscriptionUseCase = new BuySubscriptionUseCase(
  razorpayGateway,
  subscriptionPlanRepository,
  hospitalSubscriptionRepository,
  walletRepo
);

const hospitalADminSubscriptionController = new HospitalADminSubscriptionController(
  getActivePlansForListingHospitalAdminUseCase,
  createSubscriptionOrderUseCase,
  buySubscriptionUseCase
);

const getHospitalDashboardOverviewUseCase = new GetHospitalDashboardOverviewUseCase(
  hospitalDashboardRepository
);
const hospitalDashboardController = new HospitalDashboardController(
  getHospitalDashboardOverviewUseCase
);

const listHospitalLabOrdersUseCase = new ListHospitalLabOrdersUseCase(hospitalLabOrderRepository);

const uploadHospitalLabTestUseCase = new UploadHospitalLabTestUseCase(
  hospitalLabOrderRepository,
  medicalRecordRepository,
  s3FileStorage
);

const hospitalLabAdminController = new HospitalLabAdminController(
  listHospitalLabOrdersUseCase,
  uploadHospitalLabTestUseCase
);

export const hospitalAdminRoutes = new HospitalAdminRoutes(
  hospitalOnBoradingController,
  specialityMangementController,
  doctorMangmentController,
  hospitalADminSubscriptionController,
  hospitalDashboardController,
  hospitalLabAdminController
);
