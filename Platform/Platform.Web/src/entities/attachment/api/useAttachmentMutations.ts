import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attachmentKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import { attachmentDataSource } from './attachmentDataSource';
import type {
  AttachmentMetadataItem,
  UploadAttachmentDraftInput,
} from '../model/types';

/**
 * Bir dosyayı draft olarak yükler. İlişkilendirme parent entity command'ı
 * gönderildiğinde gerçekleşir; bu yüzden bu mutation cache'i invalidate etmez.
 */
export function useUploadAttachmentDraft() {
  return useMutation<AttachmentMetadataItem, AppError, UploadAttachmentDraftInput>({
    mutationFn: async (input) => {
      try {
        return await attachmentDataSource.uploadDraft(input);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
  });
}

interface DeleteAttachmentInput {
  id: string;
  entityId?: string;
  entityType?: string;
}

/**
 * Bir attachment'ı siler. Parent entity'e ilişkilendirilmişse (entityId/entityType
 * verildiyse) o entity'nin attachment listesi invalidate edilir. Draft (henüz
 * ilişkilendirilmemiş) silme işlemlerinde invalidate yapılmaz.
 */
export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, DeleteAttachmentInput>({
    mutationFn: async (input) => {
      try {
        await attachmentDataSource.delete(input.id);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (_void, input) => {
      if (input.entityId && input.entityType) {
        queryClient.invalidateQueries({
          queryKey: attachmentKeys.byEntity(input.entityType, input.entityId),
        });
      }
    },
  });
}
