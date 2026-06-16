import { useTranslation } from 'react-i18next';
import { DashboardWidgetShell, MiniBar, Text, OwnerScopeSwitch, type DashboardWidgetProps } from '@platform/ui';
import { usePipelineWidget } from '../../../../entities/dashboard/api/useDashboardQueries';
import { formatMoney, formatNumber } from '../../lib/format';

const STAGE_ORDER = ['Prospecting', 'Qualification', 'NeedsAnalysis', 'Proposal', 'Negotiation'];

export function PipelineWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const q = usePipelineWidget(ownerOnly);
  const data = q.data ?? [];
  const sorted = [...data].sort(
    (a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage),
  );
  const maxValue = Math.max(1, ...sorted.map((s) => s.totalValue));
  const isEmpty = !q.isLoading && !q.isError && sorted.length === 0;

  return (
    <DashboardWidgetShell
      title={t('widgets.pipeline')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
      isEmpty={isEmpty}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map((s) => (
          <div key={s.stage}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <Text>{t(`stages.${s.stage}`, s.stage)}</Text>
              <Text type="secondary">
                {formatNumber(s.count)} · {formatMoney(s.totalValue)}
              </Text>
            </div>
            <MiniBar percent={(s.totalValue / maxValue) * 100} />
          </div>
        ))}
      </div>
    </DashboardWidgetShell>
  );
}
