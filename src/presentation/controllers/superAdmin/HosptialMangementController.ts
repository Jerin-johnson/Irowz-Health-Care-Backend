import { Response, Request } from "express";
import { GetALLHosptialLists } from "../../../applications/usecases/superAdmin/hosptialMangement/GetAllHospital.useCase";
import { BlockOrUnblockHospitalUseCase } from "../../../applications/usecases/superAdmin/hosptialMangement/BlockOrUnBlockHospital.useCase";
import { stat } from "node:fs";

export class HospitalMangementController {
  constructor(
    private GetALLHosptialLists: GetALLHosptialLists,
    private BlockOrUnblockHospitalUseCase: BlockOrUnblockHospitalUseCase
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
    res.status(200).json({ ...result, success: true });
  };

  BlockOrUnBlockHospital = async (req: Request, res: Response) => {
    const { userId, status } = req.body;
    console.log(userId, status);
    console.log(req.body);
    const result = await this.BlockOrUnblockHospitalUseCase.execute(
      userId,
      String(status)
    );
    res.status(200).json({ ...result, success: true });
  };
}
