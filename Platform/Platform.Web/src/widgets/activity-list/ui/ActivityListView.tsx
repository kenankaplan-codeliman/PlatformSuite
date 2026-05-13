import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquareOutlined,
  MailOutlined,
  PhoneOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { ListPageLayout } from '../../../shared/ui/list-page/ListPageLayout';
import type { DataTableColumn } from '../../../shared/ui/DataTable';
import { useEnumTranslation } from '../../../shared/lib/i18n/enum';
import { useActivityListQuery } from '../../../entities/activity/api/useActivityQueries';
import {
  ACTIVITY_SLUG_BY_TYPE,
  type ActivityListFilter,
  type ActivityListItem,
  type ActivityType,
} from '../../../entities/activity/model/types';
import { RoutePaths } from '../../../app/router/paths';

const TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
  PhoneCall: <PhoneOutlined />,
  Task: <CheckSquareOutlined />,
  Appointment: <ScheduleOutlined />,
  Email: <MailOutlined />,
};

export interface ActivityListViewProps {
  filters: ActivityListFilter;
}

export function ActivityListView({ filters }: ActivityListViewProps) {
  const { t: tEntity } = useTranslation('entity.activity');
  const tType = useEnumTranslation('activityType');
  const tStatus = useEnumTranslation('activityStatus');
  const tPriority = useEnumTranslation('activityPriority');
  const navigate = useNavigate();

  const query = useActivityListQuery({ filters });

  const data = useMemo<ActivityListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<ActivityListItem>[]>(
    () => [
      {
        key: 'activityType',
        title: tEntity('fields.activityType.label'),
        render: (_v, r) => (
          <span>
            {TYPE_ICONS[r.activityType]} {tType(r.activityType)}
          </span>
        ),
      },
      {
        key: 'subject',
        title: tEntity('fields.subject.label'),
        dataIndex: 'subject',
      },
      {
        key: 'status',
        title: tEntity('fields.status.label'),
        render: (_v, r) => tStatus(r.status),
      },
      {
        key: 'priority',
        title: tEntity('fields.priority.label'),
        render: (_v, r) => tPriority(r.priority),
      },
      {
        key: 'dueDate',
        title: tEntity('fields.dueDate.label'),
        render: (_v, r) => (r.dueDate ? r.dueDate.slice(0, 10) : ''),
      },
      {
        key: 'owner',
        title: tEntity('fields.owner.label'),
        render: (_v, r) => r.owner?.name ?? '',
      },
    ],
    [tEntity, tPriority, tStatus, tType],
  );

  return (
    <ListPageLayout<ActivityListItem>
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onRowClick={(record) =>
        navigate(
          RoutePaths.ActivityView(
            ACTIVITY_SLUG_BY_TYPE[record.activityType],
            record.id,
          ),
        )
      }
    />
  );
}
