import { IHospitalLabOrderRepository } from "../../../../domain/repositories/IHospitalLabOrderRepository";

export class ListHospitalLabOrdersUseCase {
  constructor(private readonly _hospitalLabRepo: IHospitalLabOrderRepository) {}

  async execute(params: {
    hospitalId: string;
    page: number;
    limit: number;
    status?: "PENDING" | "RESULT_UPLOADED";
  }) {
    const result = await this._hospitalLabRepo.findWithPagination(params);

    return {
      data: result.data,
      pagination: {
        total: result.total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }
}
