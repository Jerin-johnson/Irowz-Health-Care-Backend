import { Response, Request } from "express";
import { ApiResponse } from "../../utils/common.response.model";
import { IGenerateSignedUrlUseCase } from "../../../domain/usecase/privateFile/IGenerateSignedUrlUseCase";

export class ViewPrivateFileController {
  constructor(private _GenerateSignedUrlUseCase: IGenerateSignedUrlUseCase) {}

  GetSignedUrlForPrivateFile = async (req: Request, res: Response) => {
    const key = req.query?.key;
    if (!key) throw new Error("something went wrong");
    console.log("The key is", key);
    const result = await this._GenerateSignedUrlUseCase.execute(key as string);
    return ApiResponse.success(res, result);
  };
}
