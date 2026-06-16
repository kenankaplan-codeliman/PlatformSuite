import { useTranslation } from 'react-i18next';
import { DashboardWidgetShell, StatBlock, Text, OwnerScopeSwitch, type DashboardWidgetProps } from '@platform/ui';
import { useWonLostWidget } from '../../../../entities/dashboard/api/useDashboardQueries';
import { formatMoney } from '../../lib/format';

export function WonLostWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const q = useWonLostWidget(ownerOnly);
  return (
    <DashboardWidgetShell
      title={t('widgets.wonLost')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
    >
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <Text type="secondary">{t('wonLostLabels.won')}</Text>
          <StatBlock value={q.data?.wonCount ?? 0} sub={formatMoney(q.data?.wonValue)} valueColor="#3f8600" />
        </div>
        <div>
          <Text type="secondary">{t('wonLostLabels.lost')}</Text>
          <StatBlock value={q.data?.lostCount ?? 0} sub={formatMoney(q.data?.lostValue)} valueColor="#cf1322" />
        </div>
      </div>
    </DashboardWidgetShell>
  );
}
