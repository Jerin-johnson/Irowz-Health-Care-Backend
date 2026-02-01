import { Request, Response } from "express";
import { GetProfileUseCase } from "../../../applications/usecases/patient/ProfileAndSetting/GetProfile.UseCase";
import { ApiResponse } from "../../utils/common.response.model";
import { EditPatientProfileUseCase } from "../../../applications/usecases/patient/ProfileAndSetting/EditPatientProfileUseCase";
import { GetWalletUseCase } from "../../../applications/usecases/patient/wallet/GetWalletUseCase";

export class PatientProfileController {
  constructor(
    private _GetProfileUseCase: GetProfileUseCase,
    private _EditPatientProfileUseCase: EditPatientProfileUseCase,
    private _GetWalletUseCase: GetWalletUseCase
  ) {}

  getProfile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const userProfile = await this._GetProfileUseCase.execute(userId as string);

    return ApiResponse.success(res, userProfile, "Profile fetched successfully");
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

    console.log("the final wallet", wallet);

    return ApiResponse.success(res, wallet);
  };
}
