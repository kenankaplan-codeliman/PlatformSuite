// TODO: shared/ui'ye Popconfirm / Tag wrapper'ları eklenince migrate et (Space zaten wrapper'ı var).
// eslint-disable-next-line no-restricted-imports
import { Popconfirm, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { formatBytes } from '../lib/formatBytes';

export interface AttachmentRowItem {
  id: string;
  fileName: string;
  fileSize: number;
  documentType: string;
  subject?: string | null;
  description?: string | null;
  createdAt?: string;
  /** UI hint — backend'e committed mi yoksa henüz pending draft mı. */
  pending?: boolean;
}

export interface AttachmentRowProps {
  item: AttachmentRowItem;
  downloadUrl: string;
  /** Sil butonu görünsün mü (view modunda gizli). */
  canDelete: boolean;
  /** Sil butonu loading state'i. */
  deleting?: boolean;
  /** Document type label çevirisi — entity-spesifik. Verilmezse raw değer gösterilir. */
  documentTypeLabel?: (value: string) => string;
  onDelete: () => void;
}

export function AttachmentRow({
  item,
  downloadUrl,
  canDelete,
  deleting,
  documentTypeLabel,
  onDelete,
}: AttachmentRowProps) {
  const { t } = useTranslation('widget.attachment');

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.fileName}
          </div>
          <Space wrap size={[8, 4]}>
            <Tag color={item.pending ? 'orange' : undefined}>
              {documentTypeLabel ? documentTypeLabel(item.documentType) : item.documentType}
            </Tag>
            {item.pending && <Tag color="orange">{t('row.pending')}</Tag>}
            <span style={{ color: '#888', fontSize: 12 }}>{formatBytes(item.fileSize)}</span>
            {item.createdAt && !item.pending && (
              <span style={{ color: '#888', fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleDateString('tr-TR')}
              </span>
            )}
          </Space>
          {item.subject && <div style={{ marginTop: 6, fontSize: 13 }}>{item.subject}</div>}
          {item.description && (
            <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>{item.description}</div>
          )}
        </div>

        <Space>
          {!item.pending && (
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13 }}>
              {t('actions.download')}
            </a>
          )}
          {canDelete && (
            <Popconfirm title={t('actions.deleteConfirm')} onConfirm={onDelete}>
              <Button danger type="link" loading={deleting}>
                {t('actions.delete')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>
    </Card>
  );
}
