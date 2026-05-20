import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import {
  AppointmentSuccessResponseDTO,
  IAppointmentSuccessOrFailureUseCase,
} from "../../../../domain/usecase/patient/BookingSlots/IAppointmentSuccessOrFailure";
import { DoctorProfileMapper } from "../../../dtos/doctor/doctorProfile.mapper";

export class ApponintmentSuccessOrFailureUseCase implements IAppointmentSuccessOrFailureUseCase {
  constructor(
    private readonly _DoctorAppointmentRepo: IDoctorAppointmentRepository,
    private readonly _DoctorRepo: IDoctorRepository
  ) {}

  async execute(appoinementId: string): Promise<AppointmentSuccessResponseDTO> {
    const result = await this._DoctorAppointmentRepo.findById(appoinementId);
    if (!result?.doctorId) throw new Error("DoctorId does exist wtf");
    const doctor = await this._DoctorRepo.findById(String(result?.doctorId));

    if (!doctor)
      throw new Error("something went wrong is doctorApponintmentSuccessOrFailureUseCase ");

    const { fullName, hospitalName, specialtyName } = DoctorProfileMapper.toView(doctor);

    // return { ...result, doctorName: fullName, hospitalName, specialtyName };

    return {
      _id: result._id.toString(),

      doctorId: result.doctorId.toString(),
      patientId: result.patientId.toString(),
      hospitalId: result.hospitalId?.toString(),

      doctorName: fullName,
      hospitalName,
      specialtyName,

      appointmentDate: result.date,

      appointmentStatus: result.status,

      startTime: result.startTime,
      endTime: result.endTime,

      paymentStatus: result.paymentStatus,

      visitType: result.visitType,

      createdAt: result.createdAt,
    };
  }
}
