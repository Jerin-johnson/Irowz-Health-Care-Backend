import { Request, Response } from "express";
import { AddHospitalSpecialtyUseCase } from "../../../applications/usecases/hospitalAdmin/specialityMangement/AddSpeciality.useCase";
import { GetAllSpecialtyUseCase } from "../../../applications/usecases/hospitalAdmin/specialityMangement/GetAllSpecialitySearch.usecase";
import { BlockOrUnblockSpecialtyUseCase } from "../../../applications/usecases/hospitalAdmin/specialityMangement/BlockOrUnblockSpeciality.useCase";
import { EditSpecialityUseCase } from "../../../applications/usecases/hospitalAdmin/specialityMangement/EditSpecialty.useCase";
import { success } from "zod";
import { GetAllSpecialtyNameUseCase } from "../../../applications/usecases/hospitalAdmin/specialityMangement/GetAllSpecialityName.userCae";

export class SpecialtyMangmentController {
  constructor(
    private readonly createHospitalSpecialtyUseCase: AddHospitalSpecialtyUseCase,
    private readonly GetAllSpecialtyUseCase: GetAllSpecialtyUseCase,
    private readonly BlockOrUnblockSpecialtyUseCase: BlockOrUnblockSpecialtyUseCase,
    private readonly EditSpecialityUseCase: EditSpecialityUseCase,
    private readonly GetAllSpecialtyNameUseCase: GetAllSpecialtyNameUseCase
  ) {}

  createSpecilty = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const specialty = await this.createHospitalSpecialtyUseCase.execute({
      hospitalId,
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Hospital specialty created successfully",
      data: specialty,
    });
  };

  getAllHospital = async (req: Request, res: Response) => {
    const { page = "1", limit = "10", search, isActive } = req.query;
    const hosptialId = req.user?.hospitalId;

    if (!hosptialId)
      return res
        .status(401)
        .json({ success: false, message: "unAthrozied User" });
    console.log(req.query, "query");
    console.log(isActive);

    let isActivePresent = false;
    if (isActive) {
      isActivePresent = true;
    }

    const result = await this.GetAllSpecialtyUseCase.execute({
      hospitalId: hosptialId,
      search: search as string | undefined,
      isActive: isActivePresent ? (isActive === "false" ? false : true) : null,
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json({ ...result, success: true });
  };

  BlockOrUnblockSpecialty = async (req: Request, res: Response) => {
    const { specailtyId, isActive } = req.body;

    const result = await this.BlockOrUnblockSpecialtyUseCase.execute({
      id: specailtyId,
      status: String(isActive),
    });
    res.status(200).json({ ...result, success: true });
  };

  editSpecialty = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const hospitalId = req.user!.hospitalId;

    const updated = await this.EditSpecialityUseCase.execute(
      id,
      hospitalId as string,
      {
        name,
        description,
      }
    );
    res.status(200).json({ ...updated, success: true });
  };

  GetAllSpecialtyName = async (req: Request, res: Response) => {
    const hospitalId = req.user!.hospitalId;

    const data = await this.GetAllSpecialtyNameUseCase.execute(
      hospitalId as string
    );
    res.status(200).json({ data, success: true });
  };
}
