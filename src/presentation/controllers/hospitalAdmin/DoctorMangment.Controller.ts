import { Request, Response } from "express";
import { AdminCreateDoctorDTO } from "../../../applications/dtos/hosptialAdmin/doctorMangement/admin-create-doctor.dto";
import { IAdminCreateDoctorUseCase } from "../../../domain/usecase/hosptialAdmin/doctorMangement/IAdminCreateDoctorUseCase.usecase";
import { IGetAllDoctorUseCase } from "../../../domain/usecase/hosptialAdmin/doctorMangement/IGetAllDoctorUseCase.usecase";
import { IBlockOrUnblockDoctorUseCase } from "../../../domain/usecase/hosptialAdmin/doctorMangement/IBlockOrUnblockDoctorUseCase.usecase";

export class DoctorMangmentController {
  constructor(
    private readonly _AdminCreateDoctorUseCase: IAdminCreateDoctorUseCase,
    private readonly _getAllDoctorUseCase: IGetAllDoctorUseCase,
    private readonly _BlockOrUnblockDoctorUseCase: IBlockOrUnblockDoctorUseCase
  ) {}

  createDoctor = async (req: Request, res: Response) => {
    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const dto: AdminCreateDoctorDTO = {
      hospitalId,
      specialtyId: req.body.specialtyId,
      experienceYears: Number(req.body.experienceYears),
      consultationFee: Number(req.body.consultationFee),
      bio: String(req.body.bio),

      medicalRegistrationNumber: String(req.body.medicalRegistrationNumber),
      medicalCouncil: req.body.medicalCouncil,

      teleConsultationEnabled: Boolean(
        req.body.teleConsultationEnabled ? true : false
      ),

      fullName: String(req.body.fullName),
      email: String(req.body.email),
      phone: String(req.body.phone),
    };

    const result = await this._AdminCreateDoctorUseCase.execute(dto);

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  };

  getDoctors = async (req: Request, res: Response) => {
    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      page = "1",
      limit = "10",
      search,
      isActive,
      specialtyId,
    } = req.query;

    const data = await this._getAllDoctorUseCase.execute({
      hospitalId,
      page: Number(page),
      limit: Number(limit),
      search: search as string | undefined,
      specialtyId: specialtyId as string | undefined,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      ...data,
    });
  };

  //   editSpecialty = async (req: Request, res: Response) => {
  //     const { id } = req.params;
  //     const { name, description } = req.body;
  //     const hospitalId = req.user!.hospitalId;

  //     const updated = await this.EditSpecialityUseCase.execute(
  //       id,
  //       hospitalId as string,
  //       {
  //         name,
  //         description,
  //       }
  //     );
  //     res.status(200).json({ ...updated, success: true });
  //   };

  BlockOrUnblockDoctor = async (req: Request, res: Response) => {
    const { isActive, doctorId } = req.body;
    // const hospitalId = req.user?.hospitalId;

    console.log("this is acive", isActive);

    const result = await this._BlockOrUnblockDoctorUseCase.execute({
      doctorId,
      status: String(isActive),
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  };
}
