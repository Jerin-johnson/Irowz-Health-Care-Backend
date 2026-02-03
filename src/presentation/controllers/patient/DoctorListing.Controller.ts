import { Request, Response } from "express";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { DoctorSearchQueryDTO } from "../../../applications/dtos/patient/doctor.search.Dto";
import { Types } from "mongoose";
import { IGetAvailableSpecialityUseCase } from "../../../domain/usecase/patient/DoctorListing/IGetAvailableSpecialityUseCase";
import { IDoctorSearchUseCase } from "../../../domain/usecase/patient/DoctorListing/IDoctorSearchUseCase";
import { IGetDoctorProfileUseCase } from "../../../domain/usecase/doctor/doctorProfile/IGetDoctorProfileUseCase.usecase";
export class DoctorListingController {
  constructor(
    private readonly _GetAvailableSpecialityUseCase: IGetAvailableSpecialityUseCase,
    private readonly _DoctorSearchUseCase: IDoctorSearchUseCase,
    private readonly _GetDoctorProfileUseCase: IGetDoctorProfileUseCase
  ) {}

  getAllSpeciality = async (req: Request, res: Response) => {
    const result = await this._GetAvailableSpecialityUseCase.execute();
    res.status(HttpStatusCode.OK).json({ success: true, data: result });
  };

  searchDoctors = async (req: Request, res: Response) => {
    const query: DoctorSearchQueryDTO = {
      search: req.query.search as string | undefined,
      specialtyId: req.query.specialtyId
        ? new Types.ObjectId(req.query.specialtyId as string)
        : undefined,
      lat: req.query.lat ? Number(req.query.lat) : undefined,
      lng: req.query.lng ? Number(req.query.lng) : undefined,
      radiusKm: req.query.radiusKm ? Number(req.query.radiusKm) : 10,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      sortBy: req.query.sortBy ? (req.query.sortBy as string) : null,
      sortOrder: req.query.sortOrder ? (req.query.sortOrder as string) : null,
    };

    const result = await this._DoctorSearchUseCase.execute(query);

    console.log(result);

    res.status(HttpStatusCode.OK).json({
      success: true,
      data: result,
    });
  };

  getDoctorProfile = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await this._GetDoctorProfileUseCase.execute(id);
    res.status(HttpStatusCode.OK).json({
      success: true,
      data: result,
    });
  };
}
