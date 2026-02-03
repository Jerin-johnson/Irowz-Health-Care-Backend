import { IDoctorAppointmentRepository } from "../../../../domain/repositories/IDoctorAppointmentRepository";
import { IPatientProfileRepository } from "../../../../domain/repositories/IPatientProfileRepository";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IGetPatientOverviewUseCase } from "../../../../domain/usecase/doctor/consultation/IGetPatientOverviewUseCase";

export class GetPatientOverViewUseCase implements IGetPatientOverviewUseCase {
  constructor(
    private _PatientProfileRepository: IPatientProfileRepository,
    private _DoctorAppointmentRepo: IDoctorAppointmentRepository,
    private _UserRepo: IUserRepository
  ) {}

  async execute(appointmentId: string) {
    const appoinment = await this._DoctorAppointmentRepo.findById(appointmentId);
    if (!appoinment) throw new Error("Appointment does not exist in db");
    const patientProfile = await this._PatientProfileRepository.findByUserId(
      String(appoinment.patientId)
    );

    const user = await this._UserRepo.findById(String(appoinment.patientId));

    return {
      patientProfile,
      appoinment,
      dob: user?.dob,
      gender: user?.gender,
    };
  }
}
