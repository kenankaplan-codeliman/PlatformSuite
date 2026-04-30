/**
 * API ile birebir uyumlu pagination tipleri.
 * Backend `CRM.Application/Common/Pagination/*.cs` ile eşleşir.
 */
export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface PaginationResponse {
  pageNumber: number;
  pageSize: number;
  hasMoreRecord: boolean;
}

export interface PagedResult<T> {
  data: T[];
  pagination: PaginationResponse;
}

export const defaultPaginationRequest: PaginationRequest = {
  pageNumber: 1,
  pageSize: 10,
};
