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
  entityId: string;
  ownerId: string;
}

export interface AssignListRequest {
  owners: AssignRequest[];
}