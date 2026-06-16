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
import { useTopAccountsWidget } from '../../../../entities/dashboard/api/useDashboardQueries';
import type { TopAccountItem } from '../../../../entities/dashboard/model/types';
import { dashboardLinks } from '../../lib/links';
import { formatMoney, formatNumber } from '../../lib/format';

export function TopAccountsWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const navigate = useNavigate();
  const q = useTopAccountsWidget(ownerOnly);
  const items = q.data?.pages.flatMap((p) => p.data) ?? [];
  const isEmpty = !q.isLoading && !q.isError && items.length === 0;

  return (
    <DashboardWidgetShell
      title={t('widgets.topAccounts')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
      isEmpty={isEmpty}
    >
      <WidgetMoreList
        items={items}
        rowKey={(a) => a.accountId}
        hasNextPage={q.hasNextPage}
        isFetchingNextPage={q.isFetchingNextPage}
        onLoadMore={() => void q.fetchNextPage()}
        renderItem={(a: TopAccountItem) => (
          <DigestRow
            onClick={() => navigate(dashboardLinks.account(a.accountId))}
            title={a.accountName}
            subtitle={t('openOpportunityCount', { count: a.openOpportunityCount })}
            meta={<Text strong>{formatMoney(a.openOpportunityValue)}</Text>}
            extra={formatNumber(a.openOpportunityCount)}
          />
        )}
      />
    </DashboardWidgetShell>
  );
}
