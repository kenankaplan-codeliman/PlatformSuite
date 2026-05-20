import { useQuery } from '@tanstack/react-query';
import { httpClient } from './httpClient';
import { ServicePath } from './servicePaths';
import { entityMetadataKeys } from './queryKeys';
import type { EntityReference } from '../types/EntityReference';

/**
 * Tüm entity'lerde ortak cross-cutting metadata (audit / owner / state).
 * Backend: Platform.Application.Common.Metadata.EntityMetadata ile birebir.
 * Entity'ye özel Detail DTO'sundan bağımsız; tek generic endpoint'ten okunur.
 */
export interface EntityMetadata {
  isActive: boolean;
  owner?: EntityReference | null;
  organization?: EntityReference | null;
  createdBy?: EntityReference | null;
  createdAt: string;
  updatedBy?: EntityReference | null;
  updatedAt?: string | null;
}

export const entityMetadataDataSource = {
  get: async (entityType: string, id: string): Promise<EntityMetadata> => {
    const response = await httpClient.post<EntityMetadata>(
      ServicePath.EntityMetadata.Get,
      { entityType, id },
    );
    return response.data;
  },
};

/**
 * Detail sayfası footer'ı için ortak metadata sorgusu. `new` modda (id yok)
 * çalışmaz. Audit/owner referans verisi nadiren değişir → uzun staleTime.
 */
export function useEntityMetadata(entityType: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: entityMetadataKeys.detail(entityType ?? 'none', id ?? 'none'),
    queryFn: () => entityMetadataDataSource.get(entityType!, id!),
    enabled: !!entityType && !!id,
    staleTime: 5 * 60 * 1000,
  });
}
