import { IHospitalSpecialty } from "../../../../infrastructure/database/mongo/models/HospitalSpeciality.model";

export interface IAddHospitalSpecialtyUseCase {
  execute(data: {
    hospitalId: string;
    name: string;
    description: string;
  }): Promise<IHospitalSpecialty>;
}
