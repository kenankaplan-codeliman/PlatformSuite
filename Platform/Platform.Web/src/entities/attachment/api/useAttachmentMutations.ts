import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attachmentKeys } from '../../../shared/api/queryKeys';
import { mapAxiosError } from '../../../shared/api/errorMapper';
import type { AppError } from '../../../shared/types/ApiError';
import { attachmentDataSource } from './attachmentDataSource';
import type {
  AttachmentMetadataItem,
  UploadAttachmentInput,
} from '../model/types';

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation<AttachmentMetadataItem, AppError, UploadAttachmentInput>({
    mutationFn: async (input) => {
      try {
        return await attachmentDataSource.upload(input);
      } catch (err) {
        throw mapAxiosError(err);
      }
    },
    onSuccess: (_saved, input) => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeys.byEntity(input.entityType, input.entityId),
      });
    },
  });
}

interface DeleteAttachmentInput {
  id: string;
  entityId: string;
  entityType: string;
}

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
      queryClient.invalidateQueries({
        queryKey: attachmentKeys.byEntity(input.entityType, input.entityId),
      });
    },
  });
}
