import { useQuery } from '@tanstack/react-query';
import { attachmentKeys } from '../../../shared/api/queryKeys';
import { attachmentDataSource } from './attachmentDataSource';

export function useAttachmentListByEntity(
  entityId: string | undefined,
  entityType: string,
) {
  return useQuery({
    queryKey: entityId
      ? attachmentKeys.byEntity(entityType, entityId)
      : attachmentKeys.byEntity(entityType, 'none'),
    queryFn: () => attachmentDataSource.listByEntity(entityId!, entityType),
    enabled: !!entityId && !!entityType,
  });
}
