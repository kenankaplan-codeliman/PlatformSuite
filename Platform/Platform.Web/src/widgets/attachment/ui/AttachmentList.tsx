import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../shared/ui/feedback/Spinner';
import { Alert } from '../../../shared/ui/feedback/Alert';
import { useAttachmentListByEntity } from '../../../entities/attachment/api/useAttachmentQueries';
import { AttachmentCard } from './AttachmentCard';

export interface AttachmentListProps {
  entityId: string | undefined;
  entityType: string;
}

export function AttachmentList({ entityId, entityType }: AttachmentListProps) {
  const { t } = useTranslation('widget.attachment');
  const { t: tCommon } = useTranslation('common');
  const query = useAttachmentListByEntity(entityId, entityType);

  if (query.isLoading) return <Spinner tip={tCommon('messages.loading')} />;
  if (query.isError) return <Alert type="error" message={tCommon('messages.unexpectedError')} />;

  const items = query.data ?? [];
  if (items.length === 0) {
    return <Alert type="info" message={t('empty')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((a) => (
        <AttachmentCard
          key={a.id}
          attachment={a}
          entityId={entityId!}
          entityType={entityType}
        />
      ))}
    </div>
  );
}
