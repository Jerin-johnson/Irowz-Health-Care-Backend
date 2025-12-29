import { ApproveVerficationRequest } from "../applications/usecases/superAdmin/hositpalVerfication/ApproveVerfication.useCase";
import { RejectVerficationRequest } from "../applications/usecases/superAdmin/hositpalVerfication/RejectVerfication.useCase";
import {
  hosptialRepository,
  hosptialVerficatinRepo,
  mongoUserRepository,
} from "./repositers";
import { HospitalVerficationController } from "../presentation/controllers/superAdmin/HosptialVerfication.controller";
import { SuperAdminRoutes } from "../presentation/routes/super_admin.routes";
import { GetALLVerficationRequest } from "../applications/usecases/superAdmin/hositpalVerfication/GetALLVerfication.useCase";
import { GetHospitalStatsUseCase } from "../applications/usecases/superAdmin/hositpalVerfication/GetHospitalStats.usecase";
import { GetVerficationRequestById } from "../applications/usecases/superAdmin/hositpalVerfication/GetVerficationRequestById";
import { GetALLHosptialLists } from "../applications/usecases/superAdmin/hosptialMangement/GetAllHospital.useCase";
import { HospitalMangementController } from "../presentation/controllers/superAdmin/HosptialMangementController";
import { BlockOrUnblockHospitalUseCase } from "../applications/usecases/superAdmin/hosptialMangement/BlockOrUnBlockHospital.useCase";
const approveVerficationRequest = new ApproveVerficationRequest(
  hosptialVerficatinRepo,
  hosptialRepository,
  mongoUserRepository
);

const rejectVerficationRequest = new RejectVerficationRequest(
  hosptialVerficatinRepo
);

const getAllVerficationRequest = new GetALLVerficationRequest(
  hosptialVerficatinRepo
);

const getHospitalStatsUseCase = new GetHospitalStatsUseCase(
  hosptialVerficatinRepo
);
const getVerficationRequestById = new GetVerficationRequestById(
  hosptialVerficatinRepo
);
const hospitalVerficationController = new HospitalVerficationController(
  approveVerficationRequest,
  rejectVerficationRequest,
  getAllVerficationRequest,
  getHospitalStatsUseCase,
  getVerficationRequestById
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

export const superAdminRoutes = new SuperAdminRoutes(
  hospitalVerficationController,
  hospitalMangementController
);
