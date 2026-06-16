/**
 * CRM Opportunity aggregate'i için kabul edilen document type değerleri.
 * Backend string olarak saklar; geçerli set burada tutulur ve
 * AttachmentsField'a `documentTypes` prop'u olarak verilir.
 */

export interface OpportunityDocumentTypeOption {
  value: string;
  label: string;
}

export const opportunityDocumentTypes: OpportunityDocumentTypeOption[] = [
  { value: 'Other', label: 'Diğer' },
  { value: 'Teklif', label: 'Teklif' },
  { value: 'Sozlesme', label: 'Sözleşme' },
  { value: 'Sartname', label: 'Şartname' },
  { value: 'Sunum', label: 'Sunum' },
  { value: 'IhtiyacAnalizi', label: 'İhtiyaç Analizi' },
  { value: 'Proforma', label: 'Proforma Fatura' },
  { value: 'SiparisFormu', label: 'Sipariş Formu' },
  { value: 'GorusmeNotu', label: 'Görüşme Notu' },
  { value: 'FizibiliteRaporu', label: 'Fizibilite Raporu' },
];

export function getOpportunityDocumentTypeLabel(value: string): string {
  return opportunityDocumentTypes.find((d) => d.value === value)?.label ?? value;
}
