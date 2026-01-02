import { Response, Request } from "express";
import { IGetAllHospitalListsUseCase } from "../../../domain/usecase/superAdmin/hospitalMangement/IGetAllHospitalListsUseCase.usecase";
import { IBlockOrUnblockHospitalUseCase } from "../../../domain/usecase/superAdmin/hospitalMangement/IBlockOrUnblockHospitalUseCase.usecase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";

export class HospitalMangementController {
  constructor(
    private GetALLHosptialLists: IGetAllHospitalListsUseCase,
    private BlockOrUnblockHospitalUseCase: IBlockOrUnblockHospitalUseCase
  ) {}

  getAllHospital = async (req: Request, res: Response) => {
    const { page = "1", limit = "10", search, isActive, city } = req.query;

    console.log(isActive);

    const result = await this.GetALLHosptialLists.execute({
      search: search as string | undefined,
      city: city as string | undefined,
      isActive: isActive === "false" ? false : true,
      page: Number(page),
      limit: Number(limit),
    });
    res.status(HttpStatusCode.OK).json({ ...result, success: true });
  };

  BlockOrUnBlockHospital = async (req: Request, res: Response) => {
    const { userId, status } = req.body;
    console.log(userId, status);
    console.log(req.body);
    const result = await this.BlockOrUnblockHospitalUseCase.execute(userId, String(status));
    res.status(HttpStatusCode.OK).json({ ...result, success: true });
  };
}
