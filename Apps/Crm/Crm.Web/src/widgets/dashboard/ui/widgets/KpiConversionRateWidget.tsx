import { useTranslation } from 'react-i18next';
import { DashboardWidgetShell, StatBlock, OwnerScopeSwitch, type DashboardWidgetProps } from '@platform/ui';
import { useConversionRateKpi } from '../../../../entities/dashboard/api/useDashboardQueries';
import { formatNumber, formatPercent } from '../../lib/format';

export function KpiConversionRateWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const q = useConversionRateKpi(ownerOnly);
  return (
    <DashboardWidgetShell
      title={t('widgets.conversionRate')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
    >
      <StatBlock
        value={formatPercent(q.data?.rate)}
        sub={t('conversionDetail', {
          converted: formatNumber(q.data?.convertedCount),
          total: formatNumber(q.data?.totalCount),
        })}
      />
    </DashboardWidgetShell>
  );
}
