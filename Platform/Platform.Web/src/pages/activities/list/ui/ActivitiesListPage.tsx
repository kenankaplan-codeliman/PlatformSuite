import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AppstoreOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  DownOutlined,
  MailOutlined,
  PhoneOutlined,
  ScheduleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button } from '../../../../shared/ui/Button';
import {
  Dropdown,
  type DropdownItem,
} from '../../../../shared/ui/Dropdown';
import { Segmented } from '../../../../shared/ui/Segmented';
import { Space } from '../../../../shared/ui/Space';
import { Title } from '../../../../shared/ui/Typography';
import { useEntityTypeRegistry } from '../../../../shared/lib/entity-type/EntityTypeRegistryContext';
import { useUrlFilters } from '../../../../shared/hooks/useUrlFilters';
import {
  ACTIVITY_SLUG_BY_TYPE,
  type ActivityListFilter,
} from '../../../../entities/activity/model/types';
import {
  activityListFilterDefaults,
  activityListFilterSchema,
} from '../../../../entities/activity/model/listFilterSchema';
import { RoutePaths } from '../../../../app/router/paths';
import { ActivityListView } from '../../../../widgets/activity-list/ui/ActivityListView';
import { ActivityCalendarView } from './ActivityCalendarView';
import { ActivitiesFilterPanel } from './ActivitiesFilterPanel';

type ViewMode = 'list' | 'calendar';

const VIEW_PARAM = 'view';

function readViewMode(params: URLSearchParams): ViewMode {
  return params.get(VIEW_PARAM) === 'calendar' ? 'calendar' : 'list';
}

export function ActivitiesListPage() {
  const { t } = useTranslation('page.activities-list');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const TitleIcon = useEntityTypeRegistry().get('Activity')?.icon;

  const { filters, setFilters, clearFilters } = useUrlFilters<ActivityListFilter>({
    schema: activityListFilterSchema,
    defaultValues: activityListFilterDefaults,
  });

  const viewMode = readViewMode(searchParams);

  const handleViewChange = (value: ViewMode) => {
    const next = new URLSearchParams(searchParams);
    next.set(VIEW_PARAM, value);
    setSearchParams(next, { replace: true });
  };

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
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {TitleIcon ? <TitleIcon /> : null}
          <span>{t('title')}</span>
        </Title>
        <Space>
          <Segmented<ViewMode>
            value={viewMode}
            onChange={handleViewChange}
            options={[
              {
                value: 'list',
                icon: <UnorderedListOutlined />,
                label: t('viewMode.list'),
              },
              {
                value: 'calendar',
                icon: <CalendarOutlined />,
                label: t('viewMode.calendar'),
              },
            ]}
          />
          <Dropdown items={createItems}>
            <Button type="primary" icon={<AppstoreOutlined />}>
              {t('createButton')} <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <ActivitiesFilterPanel
          values={filters}
          onApply={setFilters}
          onClear={clearFilters}
        />
      </div>

      {viewMode === 'list' ? (
        <ActivityListView filters={filters} />
      ) : (
        <ActivityCalendarView filters={filters} />
      )}
    </div>
  );
}
