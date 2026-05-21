/**
 * CRM Contact aggregate'i için kabul edilen document type değerleri.
 * Backend artık string olarak saklar; geçerli set burada tutulur ve
 * AttachmentsField'a `documentTypes` prop'u olarak verilir.
 */

export interface ContactDocumentTypeOption {
  value: string;
  label: string;
}

export const contactDocumentTypes: ContactDocumentTypeOption[] = [
  { value: 'Other', label: 'Diğer' },
  { value: 'KimlikFotokopisi', label: 'Kimlik Fotokopisi' },
  { value: 'Ozgecmis', label: 'Özgeçmiş (CV)' },
  { value: 'Fotograf', label: 'Fotoğraf' },
  { value: 'ImzaBeyannamesi', label: 'İmza Beyannamesi' },
  { value: 'VekaletName', label: 'Vekaletname' },
  { value: 'YetkiYazisi', label: 'Yetki Yazısı' },
  { value: 'Sozlesme', label: 'Sözleşme' },
  { value: 'GizlilikSozlesmesi', label: 'Gizlilik Sözleşmesi' },
  { value: 'KartvizitGorseli', label: 'Kartvizit Görseli' },
  { value: 'ReferansMektubu', label: 'Referans Mektubu' },
];

export function getContactDocumentTypeLabel(value: string): string {
  return contactDocumentTypes.find((d) => d.value === value)?.label ?? value;
}
