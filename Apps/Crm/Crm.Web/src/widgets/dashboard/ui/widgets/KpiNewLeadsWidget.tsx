import { useTranslation } from 'react-i18next';
import { DashboardWidgetShell, StatBlock, OwnerScopeSwitch, type DashboardWidgetProps } from '@platform/ui';
import { useNewLeadsKpi } from '../../../../entities/dashboard/api/useDashboardQueries';
import { formatNumber } from '../../lib/format';

export function KpiNewLeadsWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const q = useNewLeadsKpi(ownerOnly);
  return (
    <DashboardWidgetShell
      title={t('widgets.newLeads')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
    >
      <StatBlock value={formatNumber(q.data?.count)} />
    </DashboardWidgetShell>
  );
}
