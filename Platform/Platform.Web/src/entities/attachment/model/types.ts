/**
 * Backend DTO'su ile birebir uyumlu — Platform.Application/Features/Attachments/Dtos/AttachmentMetadataItem.
 *
 * documentType serbest string'tir; geçerli değer listesi her app tarafında
 * tanımlanır (örn. Apps/Crm/Crm.Web/src/entities/account/model/documentTypes.ts).
 */

export interface AttachmentMetadataItem {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  documentType: string;
  subject?: string | null;
  description?: string | null;
  createdAt: string;
  createdBy: string;
}

export interface UploadAttachmentDraftInput {
  file: File;
  documentType: string;
  subject?: string;
  description?: string;
}

/**
 * Parent CreateXCommand / UpdateXCommand içinde Attachments listesine konan
 * referans. Sadece metadataId taşır — documentType / subject / description
 * draft upload zamanı kaydedilmiştir.
 */
export interface AttachmentAssociation {
  metadataId: string;
}
