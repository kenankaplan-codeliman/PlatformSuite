import { useTranslation } from 'react-i18next';
import { FormSection } from '../../../shared/ui/form/FormSection';
import { useFormMode } from '../../../shared/ui/form/useFormMode';
import { AttachmentList } from './AttachmentList';
import { AttachmentUpload } from './AttachmentUpload';

export interface AttachmentPanelProps {
  /**
   * Bu attachment'ların ait olduğu entity'nin ID'si. Yeni-mod (entityId yok)
   * ise upload kapalı; entity kaydedilince re-render olur.
   */
  entityId: string | undefined;
  /** Entity type adı — string. Örn: "Lead", "Opportunity", "Brand", "Product". */
  entityType: string;
  /** Override başlık; yoksa default `widget.attachment:title` ("Ek Dosyalar"). */
  title?: string;
}

/**
 * Aggregate detail sayfalarına tek satırla düşürülen ek dosya paneli.
 * Üstte mevcut dosyaların listesi, altında yeni dosya yükleme formu.
 * View modunda yükleme gizli, sadece liste + indirme.
 *
 * Kullanım:
 * ```tsx
 * <AttachmentPanel entityType="Lead" entityId={id} />
 * ```
 */
export function AttachmentPanel({ entityId, entityType, title }: AttachmentPanelProps) {
  const { t } = useTranslation('widget.attachment');
  const formMode = (() => {
    try { return useFormMode().mode; } catch { return 'view' as const; }
  })();

  const showUpload = formMode !== 'view' && !!entityId;

  return (
    <FormSection title={title ?? t('title')}>
      <AttachmentList entityId={entityId} entityType={entityType} />
      {showUpload && (
        <div style={{ marginTop: 16 }}>
          <AttachmentUpload entityId={entityId!} entityType={entityType} />
        </div>
      )}
    </FormSection>
  );
}
