import { CreateLabOrderInput } from "../../../../applications/dtos/doctor/CreateLabOrder.dto";

export interface ICreateLabOrderUseCase {
  execute(input: CreateLabOrderInput): Promise<{ message: string }>;
}
