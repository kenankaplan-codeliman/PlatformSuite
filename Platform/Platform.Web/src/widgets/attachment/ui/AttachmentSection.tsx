import { useTranslation } from 'react-i18next';
import { FormSection } from '../../../shared/ui/form/FormSection';
import { AttachmentsField } from './AttachmentsField';
import type { DocumentTypeOption } from './AttachmentAddPanel';
import { commonDocumentTypes } from '../lib/commonDocumentTypes';

export interface AttachmentSectionProps {
  entityType: string;
  entityId?: string;
  /** İzin verilen doküman türleri. Verilmezse commonDocumentTypes kullanılır. */
  documentTypes?: DocumentTypeOption[];
  /** Dosya picker accept (örn. ".pdf,.docx,image/*"). */
  accept?: string;
  /** Section başlığı override. */
  title?: string;
  /** documentType raw değerinden gösterilecek label'a çevirici. */
  documentTypeLabel?: (value: string) => string;
}

/**
 * Convenience wrapper — entity detail sayfasına tek satırla düşürülen
 * attachment section'ı: FormSection sarması + AttachmentsField.
 *
 * Daha zengin doc type seçenekleri / accept whitelist'i gereken yerlerde
 * doğrudan FormSection + AttachmentsField ile composition yapılır
 * (örn. AccountDetailPage).
 */
export function AttachmentSection({
  entityType,
  entityId,
  documentTypes,
  accept,
  title,
  documentTypeLabel,
}: AttachmentSectionProps) {
  const { t } = useTranslation('widget.attachment');
  return (
    <FormSection title={title ?? t('title')} collapsible>
      <AttachmentsField
        entityType={entityType}
        entityId={entityId}
        accept={accept}
        documentTypes={documentTypes ?? commonDocumentTypes}
        documentTypeLabel={documentTypeLabel}
      />
    </FormSection>
  );
}
