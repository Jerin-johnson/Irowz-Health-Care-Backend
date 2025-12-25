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
const hospitalVerficationController = new HospitalVerficationController(
  approveVerficationRequest,
  rejectVerficationRequest,
  getAllVerficationRequest
);

export const superAdminRoutes = new SuperAdminRoutes(
  hospitalVerficationController
);
