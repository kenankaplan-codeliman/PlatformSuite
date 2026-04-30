import { Popconfirm, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { useFormMode } from '../../../shared/ui/form/useFormMode';
import { useEnumTranslation } from '../../../shared/lib/i18n/enum';
import { attachmentDataSource } from '../../../entities/attachment/api/attachmentDataSource';
import { useDeleteAttachment } from '../../../entities/attachment/api/useAttachmentMutations';
import type { AttachmentMetadataItem } from '../../../entities/attachment/model/types';
import { formatBytes } from '../lib/formatBytes';

export interface AttachmentCardProps {
  attachment: AttachmentMetadataItem;
  entityId: string;
  entityType: string;
}

/**
 * Tek bir attachment'ı kart olarak render eder. View modunda sadece indirme;
 * edit/new modunda silme butonu da görünür.
 */
export function AttachmentCard({ attachment, entityId, entityType }: AttachmentCardProps) {
  const { t } = useTranslation('widget.attachment');
  const tDocType = useEnumTranslation('documentType');
  const formMode = (() => {
    try { return useFormMode().mode; } catch { return 'view' as const; }
  })();
  const deleteMutation = useDeleteAttachment();

  const downloadUrl = attachmentDataSource.getDownloadUrl(attachment.id);
  const isReadOnly = formMode === 'view';

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {attachment.fileName}
          </div>
          <Space wrap size={[8, 4]}>
            <Tag>{tDocType(attachment.documentType)}</Tag>
            <span style={{ color: '#888', fontSize: 12 }}>{formatBytes(attachment.fileSize)}</span>
            <span style={{ color: '#888', fontSize: 12 }}>
              {new Date(attachment.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </Space>
          {attachment.subject && (
            <div style={{ marginTop: 6, fontSize: 13 }}>{attachment.subject}</div>
          )}
          {attachment.description && (
            <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>{attachment.description}</div>
          )}
        </div>

        <Space>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 13 }}
          >
            {t('actions.download')}
          </a>
          {!isReadOnly && (
            <Popconfirm
              title={t('actions.deleteConfirm')}
              onConfirm={() => deleteMutation.mutate({ id: attachment.id, entityId, entityType })}
            >
              <Button danger type="link" loading={deleteMutation.isPending}>
                {t('actions.delete')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>
    </Card>
  );
}
