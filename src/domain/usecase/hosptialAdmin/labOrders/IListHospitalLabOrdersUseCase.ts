import { HospitalLabOrderDocument } from "../../../../infrastructure/database/mongo/models/HospitalLabOrder.model";

export interface ListHospitalLabOrdersParams {
  hospitalId: string;
  page: number;
  limit: number;
  status?: "PENDING" | "RESULT_UPLOADED";
}

export interface ListHospitalLabOrdersResponse {
  data: HospitalLabOrderDocument[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IListHospitalLabOrdersUseCase {
  execute(params: ListHospitalLabOrdersParams): Promise<ListHospitalLabOrdersResponse>;
}
