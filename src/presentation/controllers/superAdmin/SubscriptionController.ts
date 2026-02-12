import { Response, Request } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { ICreateSubscriptionPlanUseCase } from "../../../domain/usecase/superAdmin/subcriptionMangment/ICreateSubscriptionPlanUseCase";
import { IGetActivePlansUseCase } from "../../../domain/usecase/superAdmin/subcriptionMangment/IGetActivePlansUseCase";
import { IToggleSubscription } from "../../../domain/usecase/superAdmin/subcriptionMangment/IToggleSubscription";
import { IDeleteSubscriptionUseCase } from "../../../domain/usecase/superAdmin/subcriptionMangment/IDeleteSubscriptionUseCase";
import { IGetWalletUseCase } from "../../../domain/usecase/patient/wallet/IGetWalletUseCase";

export class SubscriptionController {
  constructor(
    private readonly _CreateSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
    private readonly _GetActivePlansUseCase: IGetActivePlansUseCase,
    private readonly _ToggleSubscriptionUseCase: IToggleSubscription,
    private readonly _DeleteSubscriptionUseCase: IDeleteSubscriptionUseCase,
    private readonly _GetWalletSuperAdminUseCase: IGetWalletUseCase
  ) {}

  createSubscriptionPlan = async (req: Request, res: Response) => {
    const result = await this._CreateSubscriptionPlanUseCase.execute(req.body);
    return ApiResponse.success(res, result);
  };

  getSubscriptionPlan = async (req: Request, res: Response) => {
    const result = await this._GetActivePlansUseCase.execute();
    return ApiResponse.success(res, result);
  };

  ToggleSubscription = async (req: Request, res: Response) => {
    const id = req.params.id;
    const active = req.body.isActive;
    const result = await this._ToggleSubscriptionUseCase.execute(id, active ? true : false);
    return ApiResponse.success(res, result);
  };

  deleteSubscription = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await this._DeleteSubscriptionUseCase.execute(id);
    return ApiResponse.success(res, result);
  };

  getMyWallet = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const wallet = await this._GetWalletSuperAdminUseCase.execute(userId as string);

    return ApiResponse.success(res, wallet);
  };
}
