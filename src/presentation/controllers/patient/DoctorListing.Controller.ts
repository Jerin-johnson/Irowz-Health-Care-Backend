import { GetAvailableSpecialityUseCase } from "../../../applications/usecases/patient/DoctorListing/GetAvailbaleSpecialty.useCase";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../../domain/constants/HttpStatusCode";
import { DoctorSearchQueryDTO } from "../../../applications/dtos/patient/doctor.search.Dto";
import { Types } from "mongoose";
import { DoctorSearchUseCase } from "../../../applications/usecases/patient/DoctorListing/DoctorSearch.UseCase";
import { GetDoctorProfileUseCase } from "../../../applications/usecases/patient/DoctorListing/GetDoctorProfile";
export class DoctorListingController {
  constructor(
    private readonly _GetAvailableSpecialityUseCase: GetAvailableSpecialityUseCase,
    private readonly _DoctorSearchUseCase: DoctorSearchUseCase,
    private readonly _GetDoctorProfileUseCase: GetDoctorProfileUseCase
  ) {}

  getAllSpeciality = async (req: Request, res: Response) => {
    console.log("is this called and what is the isseu");
    const result = await this._GetAvailableSpecialityUseCase.execute();
    res.status(HttpStatusCode.OK).json({ success: true, data: result });
  };

  searchDoctors = async (req: Request, res: Response) => {
    console.log("The request query is", req.query);
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
    };

    const result = await this._DoctorSearchUseCase.execute(query);

    console.log(result);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  getDoctorProfile = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log("hai");
    const result = await this._GetDoctorProfileUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: result,
    });
  };
}
