import { Request, Response } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { UserStatusFilter } from "../../../domain/repositories/IUser.repo";
import { MarkAsVerfiedUser } from "../../../applications/usecases/superAdmin/userMangment/MarkAsVerfiedUseCase";
import { ISuperAdminGetAllUserUseCase } from "../../../domain/usecase/superAdmin/userMangment/ISuperAdminGetAllUserUseCase";
import { IBlockUserUserCase } from "../../../domain/usecase/superAdmin/userMangment/IBlockUserUserCase";
import { IUnBlockUserUserCase } from "../../../domain/usecase/superAdmin/userMangment/IUnBlockUserUserCase";

export class SuperAdminUserMangmentController {
  constructor(
    private _SuperAdminGetAllUserUseCase: ISuperAdminGetAllUserUseCase,
    private _MarkAsVerfiedUser: MarkAsVerfiedUser,
    private _BlockUserUserCase: IBlockUserUserCase,
    private _UnBlockUserUserCase: IUnBlockUserUserCase
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
