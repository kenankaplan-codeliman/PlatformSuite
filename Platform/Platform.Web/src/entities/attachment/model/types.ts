/**
 * Backend DTO'su ile birebir uyumlu — Platform.Application/Features/Attachments/Dtos/AttachmentMetadataItem.
 */

export type DocumentType =
  | 'Other'
  | 'TicaretSicilGazetesi'
  | 'VergiLevhasi'
  | 'ImzaSirkuleri'
  | 'FaaliyetBelgesi'
  | 'KapasiteRaporu'
  | 'AnaSozlesme'
  | 'KurulusKarari'
  | 'TicaretSicilBelgesi'
  | 'MersisBelgesi'
  | 'MaliTablo'
  | 'BilancoBelgesi'
  | 'KrediDerecelendirme'
  | 'BankaReferansBelgesi'
  | 'IsoSertifikasi'
  | 'UrununUygunlukBelgesi'
  | 'AkreditasyonBelgesi'
  | 'Sozlesme'
  | 'Teklif'
  | 'Siparis'
  | 'Fatura'
  | 'Irsaliye'
  | 'Sartname'
  | 'TeknikDokuman'
  | 'VekaletName'
  | 'YetkiYazisi'
  | 'ReferansMektubu'
  | 'IflasSorgulama';

export interface AttachmentMetadataItem {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  documentType: DocumentType;
  subject?: string | null;
  description?: string | null;
  createdAt: string;
  createdBy: string;
}

export interface UploadAttachmentInput {
  file: File;
  entityId: string;
  entityType: string;
  documentType: DocumentType;
  subject?: string;
  description?: string;
}
