import { useTranslation } from 'react-i18next';
import { DashboardWidgetShell, StatBlock, OwnerScopeSwitch, type DashboardWidgetProps } from '@platform/ui';
import { useOpenOpportunitiesKpi } from '../../../../entities/dashboard/api/useDashboardQueries';
import { formatMoney, formatNumber } from '../../lib/format';

export function KpiOpenOpportunitiesWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const q = useOpenOpportunitiesKpi(ownerOnly);
  return (
    <DashboardWidgetShell
      title={t('widgets.openOpportunities')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
    >
      <StatBlock value={formatNumber(q.data?.count)} sub={formatMoney(q.data?.totalValue)} />
    </DashboardWidgetShell>
  );
}
