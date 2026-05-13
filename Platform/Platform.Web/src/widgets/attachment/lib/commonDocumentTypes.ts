import type { DocumentTypeOption } from '../ui/AttachmentAddPanel';

/**
 * Paylaşılan, app'lerin override edebileceği baseline document type listesi.
 * Belirli bir entity için zenginleştirilmiş set gerektiğinde, ilgili app'in
 * entities/<x>/model/documentTypes.ts dosyası tanımlanır ve AttachmentsField'a
 * o liste verilir. Bu liste yalnızca varsayılan / generic kullanımlar içindir.
 */
export const commonDocumentTypes: DocumentTypeOption[] = [
  { value: 'Other', label: 'Diğer' },
  { value: 'Sozlesme', label: 'Sözleşme' },
  { value: 'Teklif', label: 'Teklif' },
  { value: 'Siparis', label: 'Sipariş' },
  { value: 'Fatura', label: 'Fatura' },
  { value: 'Irsaliye', label: 'İrsaliye' },
  { value: 'Sartname', label: 'Şartname' },
  { value: 'TeknikDokuman', label: 'Teknik Doküman' },
  { value: 'VergiLevhasi', label: 'Vergi Levhası' },
  { value: 'ImzaSirkuleri', label: 'İmza Sirküleri' },
  { value: 'BankaReferansBelgesi', label: 'Banka Referans Belgesi' },
];
