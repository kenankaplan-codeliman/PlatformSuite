import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DashboardWidgetShell,
  WidgetMoreList,
  DigestRow,
  OwnerScopeSwitch,
  type DashboardWidgetProps,
} from '@platform/ui';
import { useRecentActivitiesWidget } from '../../../../entities/dashboard/api/useDashboardQueries';
import type { ActivityDigestItem } from '../../../../entities/dashboard/model/types';
import { dashboardLinks } from '../../lib/links';
import { formatDate } from '../../lib/format';

export function RecentActivitiesWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const navigate = useNavigate();
  const q = useRecentActivitiesWidget(ownerOnly);
  const items = q.data?.pages.flatMap((p) => p.data) ?? [];
  const isEmpty = !q.isLoading && !q.isError && items.length === 0;

  return (
    <DashboardWidgetShell
      title={t('widgets.recentActivities')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
      isEmpty={isEmpty}
    >
      <WidgetMoreList
        items={items}
        rowKey={(a) => a.id}
        hasNextPage={q.hasNextPage}
        isFetchingNextPage={q.isFetchingNextPage}
        onLoadMore={() => void q.fetchNextPage()}
        renderItem={(a: ActivityDigestItem) => (
          <DigestRow
            onClick={() => navigate(dashboardLinks.activity(a.activityType, a.id))}
            title={a.subject}
            subtitle={t(`activityTypes.${a.activityType}`, a.activityType)}
            extra={formatDate(a.createdAt)}
          />
        )}
      />
    </DashboardWidgetShell>
  );
}
