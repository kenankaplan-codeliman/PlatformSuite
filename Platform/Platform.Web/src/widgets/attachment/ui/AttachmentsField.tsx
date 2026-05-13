import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '../../../shared/ui/Button';
import { Spinner } from '../../../shared/ui/feedback/Spinner';
import { Alert } from '../../../shared/ui/feedback/Alert';
import { EmptyState } from '../../../shared/ui/feedback/EmptyState';
import { useFormMode } from '../../../shared/ui/form/useFormMode';
import { useAttachmentListByEntity } from '../../../entities/attachment/api/useAttachmentQueries';
import {
  useDeleteAttachment,
} from '../../../entities/attachment/api/useAttachmentMutations';
import { attachmentDataSource } from '../../../entities/attachment/api/attachmentDataSource';
import type {
  AttachmentAssociation,
  AttachmentMetadataItem,
} from '../../../entities/attachment/model/types';
import { useAttachmentsCollector } from '../model/AttachmentsContext';
import { AttachmentRow, type AttachmentRowItem } from './AttachmentRow';
import {
  AttachmentAddPanel,
  type DocumentTypeOption,
} from './AttachmentAddPanel';
import { commonDocumentTypes } from '../lib/commonDocumentTypes';

export interface AttachmentsFieldProps {
  /** Bu attachment'ların ait olduğu entity'nin tipi. Örn. "Account", "Supplier". */
  entityType: string;
  /** Mevcut entity'nin ID'si. Yeni-mod (entityId yok) ise sadece pending liste. */
  entityId?: string;
  /** Kabul edilen file type'lar — input accept attribute. Örn. ".pdf,.docx,image/*". */
  accept?: string;
  /** İzin verilen document type'lar — App-spesifik whitelist. Verilmezse commonDocumentTypes. */
  documentTypes?: DocumentTypeOption[];
  /** documentType raw değerinden gösterilecek label'a çevirici (i18n). */
  documentTypeLabel?: (value: string) => string;
  /** Form readonly olduğunda eklenenleri ve silmeyi de pasifleştir (varsayılan: form mode'una uy). */
  forceReadOnly?: boolean;
}

/**
 * AttachmentsField — entity detail sayfalarına eklenen attachment yönetim
 * bileşeni. Üstte mevcut + pending dosyaların listesi, altında "Yeni Dosya Ekle"
 * butonu ve add mode paneli.
 *
 * Form schema'sı kirletmez. Pending listeyi kendi state'inde tutar; mount'ta
 * AttachmentsContext'e register olur, parent DetailPageLayout submit anında
 * pending association'ları toplar.
 */
export function AttachmentsField({
  entityType,
  entityId,
  accept,
  documentTypes,
  documentTypeLabel,
  forceReadOnly,
}: AttachmentsFieldProps) {
  const { t } = useTranslation('widget.attachment');
  const { t: tCommon } = useTranslation('common');
  const fieldId = useId();
  const collector = useAttachmentsCollector();

  // useFormMode provider yoksa default { mode: 'new', isDirty: false } döner — try/catch'e gerek yok.
  const { mode } = useFormMode();
  const isReadOnly = forceReadOnly ?? mode === 'view';

  const [pending, setPending] = useState<AttachmentMetadataItem[]>([]);
  const [addMode, setAddMode] = useState(false);

  const listQuery = useAttachmentListByEntity(entityId, entityType);
  const deleteMutation = useDeleteAttachment();

  // Collector'a register / dirty raporlama.
  useEffect(() => {
    if (!collector) return;
    const getter = () => pending.map((p): AttachmentAssociation => ({ metadataId: p.id }));
    const resetter = () => setPending([]);
    collector.registerProvider(fieldId, getter, resetter);
    return () => collector.unregisterProvider(fieldId);
    // pending değiştiğinde getter referansını güncel tutmak için register tekrar çalışsın.
  }, [collector, fieldId, pending]);

  useEffect(() => {
    if (!collector) return;
    collector.setProviderDirty(fieldId, pending.length > 0);
  }, [collector, fieldId, pending.length]);

  const handleUploaded = useCallback((metadata: AttachmentMetadataItem) => {
    setPending((prev) => [metadata, ...prev]);
    setAddMode(false);
  }, []);

  const handleDeletePending = useCallback(
    (metadataId: string) => {
      // Backend draft'ı temizle (orphan kalmasın), sonra state'ten çıkar.
      deleteMutation.mutate(
        { id: metadataId },
        {
          onSuccess: () => setPending((prev) => prev.filter((p) => p.id !== metadataId)),
        },
      );
    },
    [deleteMutation],
  );

  const handleDeleteCommitted = useCallback(
    (metadataId: string) => {
      if (!entityId) return;
      deleteMutation.mutate({ id: metadataId, entityId, entityType });
    },
    [deleteMutation, entityId, entityType],
  );

  const rows = useMemo<AttachmentRowItem[]>(() => {
    const committed: AttachmentRowItem[] = (listQuery.data ?? []).map((item) => ({
      id: item.id,
      fileName: item.fileName,
      fileSize: item.fileSize,
      documentType: item.documentType,
      subject: item.subject,
      description: item.description,
      createdAt: item.createdAt,
      pending: false,
    }));
    const pendingRows: AttachmentRowItem[] = pending.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      fileSize: item.fileSize,
      documentType: item.documentType,
      subject: item.subject,
      description: item.description,
      pending: true,
    }));
    return [...pendingRows, ...committed];
  }, [listQuery.data, pending]);

  const renderList = () => {
    if (entityId && listQuery.isLoading) return <Spinner tip={tCommon('messages.loading')} />;
    if (entityId && listQuery.isError) return <Alert type="error" message={tCommon('messages.unexpectedError')} />;

    if (rows.length === 0) {
      return <EmptyState />;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((row) => (
          <AttachmentRow
            key={row.id}
            item={row}
            downloadUrl={attachmentDataSource.getDownloadUrl(row.id)}
            canDelete={!isReadOnly}
            deleting={deleteMutation.isPending && deleteMutation.variables?.id === row.id}
            documentTypeLabel={documentTypeLabel}
            onDelete={() => (row.pending ? handleDeletePending(row.id) : handleDeleteCommitted(row.id))}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {!isReadOnly && !addMode && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddMode(true)}>
            {t('actions.add')}
          </Button>
        </div>
      )}

      {addMode && !isReadOnly && (
        <div style={{ marginBottom: 12 }}>
          <AttachmentAddPanel
            documentTypes={documentTypes ?? commonDocumentTypes}
            accept={accept}
            onUploaded={handleUploaded}
            onCancel={() => setAddMode(false)}
          />
        </div>
      )}

      {renderList()}
    </div>
  );
}
