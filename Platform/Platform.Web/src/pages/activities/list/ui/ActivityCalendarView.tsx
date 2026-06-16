import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  CheckSquareOutlined,
  LeftOutlined,
  MailOutlined,
  PhoneOutlined,
  RightOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Badge, type BadgeStatus } from '../../../../shared/ui/Badge';
import { Button } from '../../../../shared/ui/Button';
import { Calendar } from '../../../../shared/ui/calendar/Calendar';
import { Alert } from '../../../../shared/ui/feedback/Alert';
import { Spinner } from '../../../../shared/ui/feedback/Spinner';
import { Flex } from '../../../../shared/ui/Flex';
import { Space } from '../../../../shared/ui/Space';
import { Text, Title } from '../../../../shared/ui/Typography';
import { Tooltip } from '../../../../shared/ui/Tooltip';
import { useEnumTranslation } from '../../../../shared/lib/i18n/enum';
import { useActivityListQuery } from '../../../../entities/activity/api/useActivityQueries';
import {
  ACTIVITY_SLUG_BY_TYPE,
  type ActivityListFilter,
  type ActivityListItem,
  type ActivityStatus,
  type ActivityType,
} from '../../../../entities/activity/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
  PhoneCall: <PhoneOutlined />,
  Task: <CheckSquareOutlined />,
  Appointment: <ScheduleOutlined />,
  Email: <MailOutlined />,
};

const STATUS_BADGE: Record<ActivityStatus, BadgeStatus> = {
  NotStarted: 'default',
  InProgress: 'processing',
  Completed: 'success',
  Cancelled: 'error',
};

const MAX_VISIBLE_PER_DAY = 3;
const CALENDAR_PAGE_SIZE = 500;

export interface ActivityCalendarViewProps {
  filters: ActivityListFilter;
}

export function ActivityCalendarView({ filters }: ActivityCalendarViewProps) {
  const { t } = useTranslation('page.activities-list');
  const tType = useEnumTranslation('activityType');
  const navigate = useNavigate();
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs());

  const monthFilters = useMemo<ActivityListFilter>(
    () => ({
      ...filters,
      dueDateFrom: calendarDate.startOf('month').format('YYYY-MM-DD'),
      dueDateTo: calendarDate.endOf('month').format('YYYY-MM-DD'),
    }),
    [filters, calendarDate],
  );

  const query = useActivityListQuery({
    filters: monthFilters,
    pageSize: CALENDAR_PAGE_SIZE,
  });

  const activities = useMemo<ActivityListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, ActivityListItem[]>();
    for (const a of activities) {
      if (!a.dueDate) continue;
      const key = dayjs(a.dueDate).format('YYYY-MM-DD');
      const list = map.get(key);
      if (list) list.push(a);
      else map.set(key, [a]);
    }
    return map;
  }, [activities]);

  const renderDateCell = (value: Dayjs) => {
    const items = activitiesByDate.get(value.format('YYYY-MM-DD'));
    if (!items || items.length === 0) return null;
    return (
      <Flex vertical gap={2} style={{ overflow: 'hidden' }}>
        {items.slice(0, MAX_VISIBLE_PER_DAY).map((a) => (
          <div
            key={a.id}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                RoutePaths.ActivityView(
                  ACTIVITY_SLUG_BY_TYPE[a.activityType],
                  a.id,
                ),
              );
            }}
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              lineHeight: 1.4,
            }}
          >
            <Tooltip title={`${tType(a.activityType)} — ${a.subject}`}>
              <Badge
                status={STATUS_BADGE[a.status]}
                text={
                  <span>
                    <span style={{ marginRight: 4 }}>
                      {TYPE_ICONS[a.activityType]}
                    </span>
                    {a.subject}
                  </span>
                }
              />
            </Tooltip>
          </div>
        ))}
        {items.length > MAX_VISIBLE_PER_DAY && (
          <Text type="secondary">
            + {items.length - MAX_VISIBLE_PER_DAY}
          </Text>
        )}
      </Flex>
    );
  };

  const renderHeader = ({
    value,
    onChange,
  }: {
    value: Dayjs;
    onChange: (date: Dayjs) => void;
  }) => {
    const change = (next: Dayjs) => {
      onChange(next);
      setCalendarDate(next);
    };
    return (
      <Flex
        justify="space-between"
        align="center"
        style={{ padding: '8px 16px' }}
      >
        <Space>
          <Button
            icon={<LeftOutlined />}
            onClick={() => change(value.subtract(1, 'month'))}
          />
          <Button onClick={() => change(dayjs())}>{t('calendar.today')}</Button>
          <Button
            icon={<RightOutlined />}
            onClick={() => change(value.add(1, 'month'))}
          />
        </Space>
        <Title level={5} style={{ margin: 0 }}>
          {value.format('MMMM YYYY')}
        </Title>
      </Flex>
    );
  };

  if (query.isError) {
    return <Alert type="error" message={t('calendar.error')} />;
  }

  return (
    <Spinner spinning={query.isLoading}>
      <Calendar
        value={calendarDate}
        onSelect={(date) => setCalendarDate(date)}
        headerRender={renderHeader}
        cellRender={(current, info) => {
          if (info.type === 'date') return renderDateCell(current);
          return info.originNode;
        }}
      />
    </Spinner>
  );
}
