// TODO: shared/ui'ye Popconfirm / Tag wrapper'ları eklenince migrate et.
// eslint-disable-next-line no-restricted-imports
import { Popconfirm, Space, Tag } from 'antd';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '../../../shared/ui/Button';
import { Spinner } from '../../../shared/ui/feedback/Spinner';
import { Alert } from '../../../shared/ui/feedback/Alert';
import { DataTable, type DataTableColumn } from '../../../shared/ui/DataTable';
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
import {
  AttachmentAddPanel,
  type DocumentTypeOption,
} from './AttachmentAddPanel';
import { commonDocumentTypes } from '../lib/commonDocumentTypes';
import { formatBytes } from '../lib/formatBytes';

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

interface AttachmentRowItem {
  id: string;
  fileName: string;
  fileSize: number;
  documentType: string;
  subject?: string | null;
  description?: string | null;
  createdAt?: string;
  /** UI hint — backend'e committed mi yoksa henüz pending draft mı. */
  pending: boolean;
}

/**
 * AttachmentsField — entity detail sayfalarına eklenen attachment yönetim
 * bileşeni. Tablo görünümünde mevcut + pending dosyalar listelenir; üstte
 * "Yeni Dosya Ekle" butonu ve add mode paneli.
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

  const columns: DataTableColumn<AttachmentRowItem>[] = [
    {
      key: 'fileName',
      title: t('columns.fileName'),
      render: (_v, row) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.fileName}
          </div>
          {row.subject && <div style={{ color: '#666' }}>{row.subject}</div>}
          {row.description && (
            <div style={{ color: '#888' }}>{row.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'documentType',
      title: t('columns.documentType'),
      width: 200,
      render: (_v, row) => (
        <Space size={[4, 4]} wrap>
          <Tag className="entity-tag" color={row.pending ? 'orange' : undefined}>
            {documentTypeLabel ? documentTypeLabel(row.documentType) : row.documentType}
          </Tag>
          {row.pending && (
            <Tag className="entity-tag" color="orange">
              {t('row.pending')}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      key: 'size',
      title: t('columns.size'),
      width: 110,
      render: (_v, row) => <span>{formatBytes(row.fileSize)}</span>,
    },
    {
      key: 'date',
      title: t('columns.date'),
      width: 130,
      render: (_v, row) =>
        row.createdAt && !row.pending ? (
          <span>{new Date(row.createdAt).toLocaleDateString('tr-TR')}</span>
        ) : (
          <span style={{ color: '#bbb' }}>—</span>
        ),
    },
    {
      key: 'actions',
      title: t('columns.actions'),
      width: 180,
      fixed: 'right',
      render: (_v, row) => (
        <Space size={4}>
          {!row.pending && (
            <a
              href={attachmentDataSource.getDownloadUrl(row.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('actions.download')}
            </a>
          )}
          {!isReadOnly && (
            <Popconfirm
              title={t('actions.deleteConfirm')}
              onConfirm={() =>
                row.pending ? handleDeletePending(row.id) : handleDeleteCommitted(row.id)
              }
            >
              <Button
                danger
                type="link"
                size="small"
                loading={
                  deleteMutation.isPending && deleteMutation.variables?.id === row.id
                }
              >
                {t('actions.delete')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const renderList = () => {
    if (entityId && listQuery.isLoading) return <Spinner tip={tCommon('messages.loading')} />;
    if (entityId && listQuery.isError) return <Alert type="error" message={tCommon('messages.unexpectedError')} />;

    return (
      <DataTable<AttachmentRowItem>
        columns={columns}
        data={rows}
        rowKey="id"
        size="small"
      />
    );
  };

  return (
    <div>
      {renderList()}

      {addMode && !isReadOnly && (
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <AttachmentAddPanel
            documentTypes={documentTypes ?? commonDocumentTypes}
            accept={accept}
            onUploaded={handleUploaded}
            onCancel={() => setAddMode(false)}
          />
        </div>
      )}

      {!isReadOnly && !addMode && (
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={() => setAddMode(true)}
          style={{ marginTop: 12, marginBottom: 16 }}
        >
          {t('actions.add')}
        </Button>
      )}
    </div>
  );
}
