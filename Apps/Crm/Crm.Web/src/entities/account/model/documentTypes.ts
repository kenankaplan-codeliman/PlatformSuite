/**
 * CRM Account aggregate'i için kabul edilen document type değerleri.
 * Backend artık string olarak saklar; geçerli set burada tutulur ve
 * AttachmentsField'a `documentTypes` prop'u olarak verilir.
 */

export interface AccountDocumentTypeOption {
  value: string;
  label: string;
}

export const accountDocumentTypes: AccountDocumentTypeOption[] = [
  { value: 'Other', label: 'Diğer' },
  { value: 'TicaretSicilGazetesi', label: 'Ticaret Sicil Gazetesi' },
  { value: 'VergiLevhasi', label: 'Vergi Levhası' },
  { value: 'ImzaSirkuleri', label: 'İmza Sirküleri' },
  { value: 'FaaliyetBelgesi', label: 'Faaliyet Belgesi' },
  { value: 'KapasiteRaporu', label: 'Kapasite Raporu' },
  { value: 'AnaSozlesme', label: 'Ana Sözleşme' },
  { value: 'TicaretSicilBelgesi', label: 'Ticaret Sicil Belgesi' },
  { value: 'MersisBelgesi', label: 'Mersis Belgesi' },
  { value: 'BankaReferansBelgesi', label: 'Banka Referans Belgesi' },
  { value: 'Sozlesme', label: 'Sözleşme' },
  { value: 'Teklif', label: 'Teklif' },
  { value: 'VekaletName', label: 'Vekaletname' },
  { value: 'YetkiYazisi', label: 'Yetki Yazısı' },
  { value: 'ReferansMektubu', label: 'Referans Mektubu' },
];

export function getAccountDocumentTypeLabel(value: string): string {
  return accountDocumentTypes.find((d) => d.value === value)?.label ?? value;
}
