import { ApproveVerficationRequest } from "../applications/usecases/superAdmin/hositpalVerfication/ApproveVerfication.useCase";
import { RejectVerficationRequest } from "../applications/usecases/superAdmin/hositpalVerfication/RejectVerfication.useCase";
import {
  hospitalSubscriptionRepository,
  hosptialRepository,
  hosptialVerficatinRepo,
  mongoUserRepository,
  subscriptionPlanRepository,
  superAdminDashboardRepo,
  walletRepo,
} from "./repositers";
import { HospitalVerficationController } from "../presentation/controllers/superAdmin/HosptialVerfication.controller";
import { SuperAdminRoutes } from "../presentation/routes/super_admin.routes";
import { GetALLVerficationRequest } from "../applications/usecases/superAdmin/hositpalVerfication/GetALLVerfication.useCase";
import { GetHospitalStatsUseCase } from "../applications/usecases/superAdmin/hositpalVerfication/GetHospitalStats.usecase";
import { GetVerficationRequestById } from "../applications/usecases/superAdmin/hositpalVerfication/GetVerficationRequestById";
import { GetALLHosptialLists } from "../applications/usecases/superAdmin/hosptialMangement/GetAllHospital.useCase";
import { HospitalMangementController } from "../presentation/controllers/superAdmin/HosptialMangementController";
import { BlockOrUnblockHospitalUseCase } from "../applications/usecases/superAdmin/hosptialMangement/BlockOrUnBlockHospital.useCase";
import { ViewHospitalLicenseUseCase } from "../applications/usecases/superAdmin/hositpalVerfication/ViewHospitalLicenseUseCase";
import { s3FileStorage } from "./service";
import { CreateSubscriptionPlanUseCase } from "../applications/usecases/superAdmin/subscriptionMangement/CreateSubscription.UseCase";
import { GetActivePlansUseCase } from "../applications/usecases/superAdmin/subscriptionMangement/GetSubscription.UseCase";
import { SubscriptionController } from "../presentation/controllers/superAdmin/SubscriptionController";
import { DeleteSubscriptionUseCase } from "../applications/usecases/superAdmin/subscriptionMangement/DeleteSubscription.UseCase";
import { ToggleSubscription } from "../applications/usecases/superAdmin/subscriptionMangement/ToggleSubscription.UseCase";
import { GetWalletSuperAdminUseCase } from "../applications/usecases/superAdmin/wallet/SuperAdminGetWallet.UseCase";
import { SuperAdminDashboardController } from "../presentation/controllers/superAdmin/SuperAdminDashboardController";
import { GetFullDashboardOverviewUseCase } from "../applications/usecases/superAdmin/dashborad/GetDashboardOverviewUseCase";
import { SuperAdminUserMangmentController } from "../presentation/controllers/superAdmin/UserMangmentController";
import { SuperAdminGetAllUserUseCase } from "../applications/usecases/superAdmin/userMangment/GetAllUserUseCase";
import { UnBlockUserUserCase } from "../applications/usecases/superAdmin/userMangment/UnBlockUserUseCase";
import { BlockUserUserCase } from "../applications/usecases/superAdmin/userMangment/BlockUserUseCase";
import { MarkAsVerfiedUser } from "../applications/usecases/superAdmin/userMangment/MarkAsVerfiedUseCase";

const approveVerficationRequest = new ApproveVerficationRequest(
  hosptialVerficatinRepo,
  hosptialRepository,
  mongoUserRepository,
  subscriptionPlanRepository,
  hospitalSubscriptionRepository
);

const rejectVerficationRequest = new RejectVerficationRequest(hosptialVerficatinRepo);

const getAllVerficationRequest = new GetALLVerficationRequest(hosptialVerficatinRepo);

const getHospitalStatsUseCase = new GetHospitalStatsUseCase(hosptialVerficatinRepo);
const getVerficationRequestById = new GetVerficationRequestById(hosptialVerficatinRepo);

const viewHospitalLicenseUseCase = new ViewHospitalLicenseUseCase(
  hosptialVerficatinRepo,
  s3FileStorage
);
const hospitalVerficationController = new HospitalVerficationController(
  approveVerficationRequest,
  rejectVerficationRequest,
  getAllVerficationRequest,
  getHospitalStatsUseCase,
  getVerficationRequestById,
  viewHospitalLicenseUseCase
);

//hospital mangement controller

const getALLHosptialLists = new GetALLHosptialLists(hosptialRepository);
const blockOrUnblockHospitalUseCase = new BlockOrUnblockHospitalUseCase(
  mongoUserRepository,
  hosptialRepository
);
const hospitalMangementController = new HospitalMangementController(
  getALLHosptialLists,
  blockOrUnblockHospitalUseCase
);

const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(subscriptionPlanRepository);
const getActivePlansUseCase = new GetActivePlansUseCase(subscriptionPlanRepository);

const toggleSubscription = new ToggleSubscription(subscriptionPlanRepository);
const deleteSubscriptionUseCase = new DeleteSubscriptionUseCase(subscriptionPlanRepository);

const getWalletSuperAdminUseCase = new GetWalletSuperAdminUseCase(walletRepo);

const subscriptionController = new SubscriptionController(
  createSubscriptionPlanUseCase,
  getActivePlansUseCase,
  toggleSubscription,
  deleteSubscriptionUseCase,
  getWalletSuperAdminUseCase
);

const getFullDashboardOverviewUseCase = new GetFullDashboardOverviewUseCase(
  superAdminDashboardRepo
);

const superAdminDashboardController = new SuperAdminDashboardController(
  getFullDashboardOverviewUseCase
);
const superAdminGetAllUserUseCase = new SuperAdminGetAllUserUseCase(mongoUserRepository);

const markAsVerfiedUser = new MarkAsVerfiedUser(mongoUserRepository);

const blockUserUserCase = new BlockUserUserCase(mongoUserRepository);
const unBlockUserUserCase = new UnBlockUserUserCase(mongoUserRepository);
const superAdminUserMangmentController = new SuperAdminUserMangmentController(
  superAdminGetAllUserUseCase,
  markAsVerfiedUser,
  blockUserUserCase,
  unBlockUserUserCase
);

export const superAdminRoutes = new SuperAdminRoutes(
  hospitalVerficationController,
  hospitalMangementController,
  subscriptionController,
  superAdminDashboardController,
  superAdminUserMangmentController
);
