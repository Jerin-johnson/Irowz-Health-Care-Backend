import { Request, Response } from "express";
import { SuperAdminGetAllUserUseCase } from "../../../applications/usecases/superAdmin/userMangment/GetAllUserUseCase";
import { ApiResponse } from "../../utils/common.response.model";
import { UserStatusFilter } from "../../../domain/repositories/IUser.repo";
import { MarkAsVerfiedUser } from "../../../applications/usecases/superAdmin/userMangment/MarkAsVerfiedUseCase";
import { BlockUserUserCase } from "../../../applications/usecases/superAdmin/userMangment/BlockUserUseCase";
import { UnBlockUserUserCase } from "../../../applications/usecases/superAdmin/userMangment/UnBlockUserUseCase";

export class SuperAdminUserMangmentController {
  constructor(
    private _SuperAdminGetAllUserUseCase: SuperAdminGetAllUserUseCase,
    private _MarkAsVerfiedUser: MarkAsVerfiedUser,
    private _BlockUserUserCase: BlockUserUserCase,
    private _UnBlockUserUserCase: UnBlockUserUserCase
  ) {}

  getAllUsers = async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const role = req.query.role as string | undefined;
    const status = req.query.status;
    const result = await this._SuperAdminGetAllUserUseCase.execute(
      { page, limit },
      role,
      status as UserStatusFilter
    );

    return ApiResponse.success(res, result);
  };

  MarkUserAsVerfied = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await this._MarkAsVerfiedUser.execute(userId);
    return ApiResponse.success(res, result);
  };

  BlockUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await this._BlockUserUserCase.execute(userId);
    return ApiResponse.success(res, result);
  };

  UnBlockUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await this._UnBlockUserUserCase.execute(userId);
    return ApiResponse.success(res, result);
  };
}
