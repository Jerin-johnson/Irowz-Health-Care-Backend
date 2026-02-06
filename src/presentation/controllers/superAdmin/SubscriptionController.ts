import { Response, Request } from "express";
import { CreateSubscriptionPlanUseCase } from "../../../applications/usecases/superAdmin/subscriptionMangement/CreateSubscription.UseCase";
import { GetActivePlansUseCase } from "../../../applications/usecases/superAdmin/subscriptionMangement/GetSubscription.UseCase";
import { ApiResponse } from "../../utils/common.response.model";
import { ToggleSubscription } from "../../../applications/usecases/superAdmin/subscriptionMangement/ToggleSubscription.UseCase";
import { DeleteSubscriptionUseCase } from "../../../applications/usecases/superAdmin/subscriptionMangement/DeleteSubscription.UseCase";
import { GetWalletSuperAdminUseCase } from "../../../applications/usecases/superAdmin/wallet/SuperAdminGetWallet.UseCase";

export class SubscriptionController {
  constructor(
    private readonly _CreateSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase,
    private readonly _GetActivePlansUseCase: GetActivePlansUseCase,
    private readonly _ToggleSubscriptionUseCase: ToggleSubscription,
    private readonly _DeleteSubscriptionUseCase: DeleteSubscriptionUseCase,
    private readonly _GetWalletSuperAdminUseCase: GetWalletSuperAdminUseCase
  ) {}

  createSubscriptionPlan = async (req: Request, res: Response) => {
    console.log("The req body is", req.body);
    const result = await this._CreateSubscriptionPlanUseCase.execute(req.body);
    console.log("The result  is ", result);
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
