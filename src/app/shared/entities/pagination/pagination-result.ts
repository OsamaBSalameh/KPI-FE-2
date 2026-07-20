export interface PaginationResult {
  hasNextPage: boolean,
  hasPreviousPage: boolean,

  totalCount: number,
  pageIndex: number,
  totalPages: number
}
