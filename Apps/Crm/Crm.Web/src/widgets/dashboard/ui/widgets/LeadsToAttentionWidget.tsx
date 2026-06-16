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
import { useLeadsToAttentionWidget } from '../../../../entities/dashboard/api/useDashboardQueries';
import type { LeadDigestItem } from '../../../../entities/dashboard/model/types';
import { dashboardLinks } from '../../lib/links';
import { formatNumber } from '../../lib/format';

const RATING_COLOR = {
  Hot: 'red',
  Warm: 'orange',
  Cold: 'blue',
} as const;

export function LeadsToAttentionWidget({ ownerOnly, onOwnerOnlyChange }: DashboardWidgetProps) {
  const { t } = useTranslation('page.dashboard');
  const navigate = useNavigate();
  const q = useLeadsToAttentionWidget(ownerOnly);
  const items = q.data?.pages.flatMap((p) => p.data) ?? [];
  const isEmpty = !q.isLoading && !q.isError && items.length === 0;

  return (
    <DashboardWidgetShell
      title={t('widgets.leadsToAttention')}
      extra={<OwnerScopeSwitch ownerOnly={ownerOnly} onChange={onOwnerOnlyChange} />}
      isLoading={q.isLoading}
      isError={q.isError}
      error={q.error}
      onRetry={() => void q.refetch()}
      isEmpty={isEmpty}
    >
      <WidgetMoreList
        items={items}
        rowKey={(l) => l.id}
        hasNextPage={q.hasNextPage}
        isFetchingNextPage={q.isFetchingNextPage}
        onLoadMore={() => void q.fetchNextPage()}
        renderItem={(l: LeadDigestItem) => (
          <DigestRow
            onClick={() => navigate(dashboardLinks.lead(l.id))}
            title={l.fullName?.trim() || l.subject}
            subtitle={l.company ?? undefined}
            meta={
              l.rating ? (
                <MiniTag color={RATING_COLOR[l.rating as keyof typeof RATING_COLOR] ?? 'default'}>
                  {t(`ratings.${l.rating}`, l.rating)}
                </MiniTag>
              ) : undefined
            }
            extra={l.score != null ? t('scoreLabel', { score: formatNumber(l.score) }) : undefined}
          />
        )}
      />
    </DashboardWidgetShell>
  );
}
