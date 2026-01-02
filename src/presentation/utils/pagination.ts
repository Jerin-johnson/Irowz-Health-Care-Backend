export interface PaginationResult {
  skip: number;
  limit: number;
  page: number;
}

export const getPagination = (page?: number, limit?: number): PaginationResult => {
  const safePage = page && page > 0 ? page : 1;
  const safeLimit = limit && limit > 0 && limit <= 100 ? limit : 10;

  return {
    skip: (safePage - 1) * safeLimit,
    limit: safeLimit,
    page: safePage,
  };
};
