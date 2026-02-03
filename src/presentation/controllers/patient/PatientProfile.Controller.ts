import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { IGetProfileUseCase } from "../../../domain/usecase/patient/Profile&settings/IGetProfileUseCase";
import { IEditPatientProfileUseCase } from "../../../domain/usecase/patient/Profile&settings/IEditPatientProfileUseCase";
import { IGetWalletUseCase } from "../../../domain/usecase/patient/wallet/IGetWalletUseCase";
import { PatientMessages } from "../../constants/message/Patient.message";

export class PatientProfileController {
  constructor(
    private _GetProfileUseCase: IGetProfileUseCase,
    private _EditPatientProfileUseCase: IEditPatientProfileUseCase,
    private _GetWalletUseCase: IGetWalletUseCase
  ) {}

  getProfile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const userProfile = await this._GetProfileUseCase.execute(userId as string);

    return ApiResponse.success(res, userProfile, PatientMessages.PROFILE_FETCHED);
  };

  editProfile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const file = req.file;

    await this._EditPatientProfileUseCase.execute(userId as string, req.body, file);

    return ApiResponse.success(res);
  };

  getMyWallet = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const wallet = await this._GetWalletUseCase.execute(userId as string);

    return ApiResponse.success(res, wallet);
  };
}
