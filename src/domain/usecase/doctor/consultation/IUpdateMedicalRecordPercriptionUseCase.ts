import { UpdateMedicalRecordInput } from "../../../../applications/dtos/doctor/PercritpitonDto";

export interface IUpdateMedicalRecordPercriptionUseCase {
  execute(input: UpdateMedicalRecordInput): Promise<{ message: string }>;
}
