import { Request, Response } from "express";
import { IAddHospitalSpecialtyUseCase } from "../../../domain/usecase/hosptialAdmin/specialityMangement/IAddHospitalSpecialtyUseCase.usecase";
import { IGetAllSpecialtyUseCase } from "../../../domain/usecase/hosptialAdmin/specialityMangement/IGetAllSpecialtyUseCase.usecase";
import { IBlockOrUnblockSpecialtyUseCase } from "../../../domain/usecase/hosptialAdmin/specialityMangement/IBlockOrUnblockSpecialtyUseCase.usecase";
import { IEditSpecialityUseCase } from "../../../domain/usecase/hosptialAdmin/specialityMangement/IEditSpecialityUseCase.usecase";
import { IGetAllSpecialtyNameUseCase } from "../../../domain/usecase/hosptialAdmin/specialityMangement/IGetAllSpecialtyNameUseCase.usecase";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { createSpeciltyDtoInput } from "../../../applications/dtos/hosptial/createSpecailityDto";
import { ApiResponse } from "../../utils/common.response.model";
import { CommonMessages } from "../../constants/message/CommonMessages";
import { HospitalAdminMessages } from "../../constants/message/HospitalAdminMessages";

export class SpecialtyMangmentController {
  constructor(
    private readonly createHospitalSpecialtyUseCase: IAddHospitalSpecialtyUseCase,
    private readonly GetAllSpecialtyUseCase: IGetAllSpecialtyUseCase,
    private readonly BlockOrUnblockSpecialtyUseCase: IBlockOrUnblockSpecialtyUseCase,
    private readonly EditSpecialityUseCase: IEditSpecialityUseCase,
    private readonly GetAllSpecialtyNameUseCase: IGetAllSpecialtyNameUseCase
  ) {}

  createSpecilty = async (req: Request, res: Response) => {
    const { name, description, symptoms } = req.body as createSpeciltyDtoInput;
    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      ApiResponse.error(res, CommonMessages.INVALID_REQUEST, HttpStatusCode.UNAUTHORIZED);
      return;
    }

    const specialty = await this.createHospitalSpecialtyUseCase.execute({
      hospitalId,
      name,
      description,
      symptoms,
    });

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: HospitalAdminMessages.SPECIALTY_CREATED,
      data: specialty,
    });
    return;
  };

  getAllHospitalSpeciality = async (req: Request, res: Response) => {
    const { page = "1", limit = "10", search, isActive } = req.query;
    const hosptialId = req.user?.hospitalId;

    if (!hosptialId) {
      ApiResponse.error(res, CommonMessages.INVALID_REQUEST, HttpStatusCode.UNAUTHORIZED);
      return;
    }

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
    res.status(HttpStatusCode.OK).json({ ...result, success: true });
  };

  BlockOrUnblockSpecialty = async (req: Request, res: Response) => {
    const { specailtyId, isActive } = req.body;

    const result = await this.BlockOrUnblockSpecialtyUseCase.execute({
      id: specailtyId,
      status: String(isActive),
    });
    res.status(HttpStatusCode.OK).json({ ...result, success: true });
  };

  editSpecialty = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, symptoms } = req.body;
    const hospitalId = req.user!.hospitalId;

    const updated = await this.EditSpecialityUseCase.execute(id, hospitalId as string, {
      name,
      description,
      symptoms,
    });
    res.status(HttpStatusCode.OK).json({ ...updated, success: true });
  };

  GetAllSpecialtyName = async (req: Request, res: Response) => {
    const hospitalId = req.user!.hospitalId;

    const data = await this.GetAllSpecialtyNameUseCase.execute(hospitalId as string);
    res.status(HttpStatusCode.OK).json({ data, success: true });
  };
}
