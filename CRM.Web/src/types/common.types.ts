export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface IdRequest {
  id: string;
}

export interface IdListRequest {
  ids: string[];
}

export interface AssignRequest {
  ids: string[];
  ownerId: string;
}

export interface StatusRequest {
  ids: string[];
  isActive: boolean;
}