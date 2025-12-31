import { Types } from "mongoose";
import { AdminCreateDoctorDTO } from "../../../../applications/dtos/hosptialAdmin/doctorMangement/admin-create-doctor.dto";

export interface IAdminCreateDoctorUseCase {
  execute(input: AdminCreateDoctorDTO): Promise<{
    doctorId: Types.ObjectId | string;
    userId: string | Types.ObjectId;
  }>;
}
