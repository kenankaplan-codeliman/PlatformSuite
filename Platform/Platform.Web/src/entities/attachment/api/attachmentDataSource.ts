import { httpClient } from '../../../shared/api/httpClient';
import { ServicePath } from '../../../shared/api/servicePaths';
import type {
  AttachmentMetadataItem,
  UploadAttachmentInput,
} from '../model/types';

interface ListBody {
  entityId: string;
  entityType: string;
}

interface IdBody {
  id: string;
}

export const attachmentDataSource = {
  listByEntity: async (entityId: string, entityType: string): Promise<AttachmentMetadataItem[]> => {
    const response = await httpClient.post<AttachmentMetadataItem[]>(
      ServicePath.Attachment.List,
      { entityId, entityType } satisfies ListBody,
    );
    return response.data;
  },

  upload: async (input: UploadAttachmentInput): Promise<AttachmentMetadataItem> => {
    const formData = new FormData();
    formData.append('file', input.file);
    formData.append('entityId', input.entityId);
    formData.append('entityType', input.entityType);
    formData.append('documentType', input.documentType);
    if (input.subject) formData.append('subject', input.subject);
    if (input.description) formData.append('description', input.description);

    const response = await httpClient.post<AttachmentMetadataItem>(
      ServicePath.Attachment.Upload,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.post(ServicePath.Attachment.Delete, { id } satisfies IdBody);
  },

  /** GET ile dosya stream — window.open / link href olarak kullanılır. */
  getDownloadUrl: (id: string): string => `${ServicePath.Attachment.Download}/${id}`,
};
