import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Text } from '../../../shared/ui/Typography';
import { Alert } from '../../../shared/ui/feedback/Alert';
import { Spinner } from '../../../shared/ui/feedback/Spinner';
import { EmptyState } from '../../../shared/ui/feedback/EmptyState';

interface DashboardWidgetShellProps {
  title: string;
  /** Başlık sağındaki alan (owner switch vb.). */
  extra?: ReactNode;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

/**
 * Tüm widget'ları saran kart: başlık + loading + hata/yetki durumları.
 * 403 (yetkisiz) durumunda korkutucu hata yerine sade bir not gösterir — backend
 * her endpoint'i ilgili privilege ile zaten koruyor.
 */
export function DashboardWidgetShell({
  title,
  extra,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyText,
  onRetry,
  children,
}: DashboardWidgetShellProps) {
  const { t } = useTranslation('widget.dashboard');
  const status = (error as { response?: { status?: number } } | undefined)?.response?.status;

  let body: ReactNode;
  if (isLoading) {
    body = <Spinner />;
  } else if (isError && status === 403) {
    body = <Text type="secondary">{t('forbidden')}</Text>;
  } else if (isError) {
    body = (
      <div>
        <Alert type="error" message={t('error')} />
        {onRetry ? (
          <div style={{ marginTop: 8 }}>
            <Button size="small" onClick={onRetry}>
              {t('retry')}
            </Button>
          </div>
        ) : null}
      </div>
    );
  } else if (isEmpty) {
    body = <EmptyState description={emptyText ?? t('empty')} />;
  } else {
    body = children;
  }

  return (
    <Card
      size="small"
      title={title}
      extra={extra}
      styles={{ header: { background: '#fafafa' } }}
    >
      {body}
    </Card>
  );
}
