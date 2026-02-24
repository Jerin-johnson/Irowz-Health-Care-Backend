import { UploadHospitalLabResultInput } from "../../../../applications/dtos/hosptial/labOrder.dto";

export interface IUploadHospitalLabTestUseCase {
  execute(input: UploadHospitalLabResultInput): Promise<{ message: string }>;
}
