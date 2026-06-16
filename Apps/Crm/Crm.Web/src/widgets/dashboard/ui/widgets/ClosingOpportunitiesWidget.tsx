import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DashboardWidgetShell,
  WidgetMoreList,
  DigestRow,
  Text,
  OwnerScopeSwitch,
  type DashboardWidgetProps,
} from '@platform/ui';
import { useClosingOpportunitiesWidget } from '../../../../entities/dashboard/api/useDashboardQueries';
import type { OpportunityDigestItem } from '../../../../entities/dashboard/model/types';
import { dashboardLinks } from '../../lib/links';
import { formatDate, formatMoney } from '../../lib/format';

export function ClosingOpportunitiesWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const navigate = useNavigate();
  const q = useClosingOpportunitiesWidget(ownerOnly);
  const items = q.data?.pages.flatMap((p) => p.data) ?? [];
  const isEmpty = !q.isLoading && !q.isError && items.length === 0;

  return (
    <DashboardWidgetShell
      title={t('widgets.closingOpportunities')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
      isEmpty={isEmpty}
    >
      <WidgetMoreList
        items={items}
        rowKey={(o) => o.id}
        hasNextPage={q.hasNextPage}
        isFetchingNextPage={q.isFetchingNextPage}
        onLoadMore={() => void q.fetchNextPage()}
        renderItem={(o: OpportunityDigestItem) => (
          <DigestRow
            onClick={() => navigate(dashboardLinks.opportunity(o.id))}
            title={o.name}
            subtitle={o.accountName ?? undefined}
            meta={<Text strong>{formatMoney(o.amount, o.currency)}</Text>}
            extra={formatDate(o.closeDate)}
          />
        )}
      />
    </DashboardWidgetShell>
  );
}
