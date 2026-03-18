import type { EntityReference, EntityTypeValue } from "./entity.lookup.types";

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


export interface AuditRequest {
  entityType: EntityTypeValue;
  id: string;
}

export interface AuditInfo {
  owner?: EntityReference;
  createdAt?: Date;
  createdBy?: EntityReference;
  updatedAt?: Date;
  updatedBy?: EntityReference;
}