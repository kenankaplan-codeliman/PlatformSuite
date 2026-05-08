import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  CheckSquareOutlined,
  DownOutlined,
  MailOutlined,
  PhoneOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Button } from '../../../../shared/ui/Button';
import {
  Dropdown,
  type DropdownItem,
} from '../../../../shared/ui/Dropdown';
import { ListPageLayout } from '../../../../shared/ui/list-page/ListPageLayout';
import type { DataTableColumn } from '../../../../shared/ui/DataTable';
import { useEnumTranslation } from '../../../../shared/lib/i18n/enum';
import { useActivityListQuery } from '../../../../entities/activity/api/useActivityQueries';
import {
  ACTIVITY_SLUG_BY_TYPE,
  type ActivityListFilter,
  type ActivityListItem,
  type ActivityType,
} from '../../../../entities/activity/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
  PhoneCall: <PhoneOutlined />,
  Task: <CheckSquareOutlined />,
  Appointment: <ScheduleOutlined />,
  Email: <MailOutlined />,
};

export function ActivitiesListPage() {
  const { t } = useTranslation('page.activities-list');
  const { t: tEntity } = useTranslation('entity.activity');
  const tType = useEnumTranslation('activityType');
  const tStatus = useEnumTranslation('activityStatus');
  const tPriority = useEnumTranslation('activityPriority');
  const navigate = useNavigate();

  const [filters] = useState<ActivityListFilter>({});

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

  const createItems: DropdownItem[] = [
    {
      key: 'phoneCall',
      icon: <PhoneOutlined />,
      label: t('createMenu.phoneCall'),
      onClick: () =>
        navigate(RoutePaths.ActivityNew(ACTIVITY_SLUG_BY_TYPE.PhoneCall)),
    },
    {
      key: 'task',
      icon: <CheckSquareOutlined />,
      label: t('createMenu.task'),
      onClick: () =>
        navigate(RoutePaths.ActivityNew(ACTIVITY_SLUG_BY_TYPE.Task)),
    },
    {
      key: 'appointment',
      icon: <ScheduleOutlined />,
      label: t('createMenu.appointment'),
      onClick: () =>
        navigate(RoutePaths.ActivityNew(ACTIVITY_SLUG_BY_TYPE.Appointment)),
    },
    {
      key: 'email',
      icon: <MailOutlined />,
      label: t('createMenu.email'),
      onClick: () =>
        navigate(RoutePaths.ActivityNew(ACTIVITY_SLUG_BY_TYPE.Email)),
    },
  ];

  return (
    <ListPageLayout<ActivityListItem>
      title={t('title')}
      columns={columns}
      data={data}
      rowKey="id"
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      headerActions={
        <Dropdown items={createItems}>
          <Button type="primary" icon={<AppstoreOutlined />}>
            {t('createButton')} <DownOutlined />
          </Button>
        </Dropdown>
      }
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
