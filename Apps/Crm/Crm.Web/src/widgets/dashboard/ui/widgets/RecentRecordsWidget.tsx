import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DashboardWidgetShell,
  WidgetMoreList,
  DigestRow,
  MiniTag,
  OwnerScopeSwitch,
  type DashboardWidgetProps,
} from '@platform/ui';
import { useRecentRecordsWidget } from '../../../../entities/dashboard/api/useDashboardQueries';
import type { RecentRecordItem } from '../../../../entities/dashboard/model/types';
import { dashboardLinks } from '../../lib/links';
import { formatDate } from '../../lib/format';

export function RecentRecordsWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const navigate = useNavigate();
  const q = useRecentRecordsWidget(ownerOnly);
  const items = q.data?.pages.flatMap((p) => p.data) ?? [];
  const isEmpty = !q.isLoading && !q.isError && items.length === 0;

  const navigateTo = (r: RecentRecordItem) =>
    navigate(r.entityType === 'Contact' ? dashboardLinks.contact(r.id) : dashboardLinks.account(r.id));

  return (
    <DashboardWidgetShell
      title={t('widgets.recentRecords')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
      isEmpty={isEmpty}
    >
      <WidgetMoreList
        items={items}
        rowKey={(r) => `${r.entityType}-${r.id}`}
        hasNextPage={q.hasNextPage}
        isFetchingNextPage={q.isFetchingNextPage}
        onLoadMore={() => void q.fetchNextPage()}
        renderItem={(r: RecentRecordItem) => (
          <DigestRow
            onClick={() => navigateTo(r)}
            title={r.name}
            meta={
              <MiniTag color={r.entityType === 'Contact' ? 'cyan' : 'geekblue'}>
                {t(`entityTypes.${r.entityType}`, r.entityType)}
              </MiniTag>
            }
            extra={formatDate(r.createdAt)}
          />
        )}
      />
    </DashboardWidgetShell>
  );
}
